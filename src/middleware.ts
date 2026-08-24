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
