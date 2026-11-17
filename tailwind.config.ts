import type { Config } from "tailwindcss";

/**
 * Loaded from src/app/globals.css via `@config`. Tailwind v4 detects source
 * files automatically; `content` is kept for editor tooling. Colours come from
 * Tailwind's built-in neutral scale, so no custom palette is defined here.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
