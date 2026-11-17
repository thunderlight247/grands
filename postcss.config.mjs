/**
 * Tailwind itself is compiled by the @tailwindcss/turbopack loader configured
 * in next.config.ts, so it isn't listed here. Autoprefixer adds vendor
 * prefixes for older mobile browsers.
 */
const config = {
  plugins: {
    autoprefixer: {},
  },
};

export default config;
