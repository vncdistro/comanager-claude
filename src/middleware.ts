import { defineMiddleware } from 'astro:middleware';

// 50/50 A/B test: control = / (home), variant = /chat.
// Server-side split via rewrite — the address-bar URL always stays "/".
// (Astro's equivalent of Next.js middleware + NextResponse.rewrite().)

const COOKIE = 'ab-lp';
const CONTROL = 'control';
const TEST = 'test';
const VARIANT_PATH = '/chat';

export const onRequest = defineMiddleware((context, next) => {
  // Match ONLY the control route; every other path is untouched.
  if (context.url.pathname !== '/') return next();

  let variant = context.cookies.get(COOKIE)?.value;

  // Team override: ?ab=control | ?ab=off  → force the control page
  //                ?ab=test    | ?ab=variant → force the /chat variant
  // The choice is written to the cookie so it sticks for that browser
  // (switch again with the opposite value). ab-forced marks the visit so
  // analytics can filter internal checks out.
  const forced = context.url.searchParams.get('ab');
  if (forced) {
    const want = forced === 'test' || forced === 'variant' ? TEST
      : forced === 'control' || forced === 'off' ? CONTROL
      : null;
    if (want) {
      variant = want;
      context.cookies.set(COOKIE, want, { path: '/', maxAge: 31536000, httpOnly: false, sameSite: 'lax' });
      context.cookies.set('ab-forced', '1', { path: '/', maxAge: 31536000, httpOnly: false, sameSite: 'lax' });
      return want === TEST ? next(VARIANT_PATH) : next();
    }
  }

  if (variant !== CONTROL && variant !== TEST) {
    // First visit: assign 50/50 and persist for a year.
    variant = Math.random() < 0.5 ? CONTROL : TEST;
    context.cookies.set(COOKIE, variant, {
      path: '/',
      maxAge: 31536000,
      httpOnly: false, // client JS must read it to stamp analytics
      sameSite: 'lax',
    });
  }

  // Rewrite (NOT redirect): serves /chat's content under the "/" URL.
  // next(path) continues the chain with the new route and does not re-enter
  // this middleware, so there is no rewrite loop.
  return variant === TEST ? next(VARIANT_PATH) : next();
});
