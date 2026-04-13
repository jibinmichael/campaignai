import type { Config } from "tailwindcss";

/**
 * Global typography: document smoothing lives in `src/globals.css` (`html` /
 * `body`, `@layer base`). Sans stack matches `--font-sans` (system-ui).
 */
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ["system-ui", "sans-serif"],
      },
      colors: {
        /** Light neutral border (black scale step 100) */
        "black-100": "#f2f2f2",
      },
      fontSize: {
        /** One step below 13px root: `text-sm` stays legible on dense UIs */
        sm: ["12px", { lineHeight: "1.5" }],
        base: ["1rem", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        body: "-0.01em",
      },
    },
  },
} satisfies Config;
