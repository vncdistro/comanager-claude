import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// Matches Webflow Cloud's official Astro setup: base = mount path, server
// output on the Cloudflare adapter. Webflow serves the build at /cmngr and the
// ASSETS binding serves everything in ./dist (static files land under dist/cmngr).
export default defineConfig({
  base: '/',
  output: 'server',
  adapter: cloudflare({
    platformProxy: { enabled: true },
  }),
});
