import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { files: ["tests/**/*.cjs"], rules: { "@typescript-eslint/no-require-imports": "off", "@next/next/no-assign-module-variable": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-dev/**",
    ".next-qa/**",
    ".next-build-qa/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "generated/**",
    ".implementation-backup/**",
    ".qa/**",
  ]),
]);

export default eslintConfig;
