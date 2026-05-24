import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**/*.cjs",
  ]),
  {
    rules: {
      // This small static site intentionally reads localStorage once after hydration
      // for theme/lang preferences. The synchronous state set avoids shipping extra
      // cookie/server plumbing for a non-critical preference toggle.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
