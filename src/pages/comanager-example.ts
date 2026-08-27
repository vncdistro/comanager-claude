// /comanager-example — static replica of the Webflow page
// (https://comanager-22f913.webflow.io/comanager-example), served byte-exact.
// Assets are self-hosted under /example-assets (HTML-level and CSS-internal
// URLs rewritten at capture time). Do not hand-edit page.html — recapture.
import html from '../exampleref/page.html?raw';

export const prerender = false;

export function GET() {
  return new Response(html, {
    headers: { 'content-type': 'text/html; charset=utf-8' },
  });
}
