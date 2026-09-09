import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: {
      js,
      "@stylistic": stylistic
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser
    },
    rules: {
      "@stylistic/indent": ["error", 2, { SwitchCase: 1 }],
      "@stylistic/quotes": ["error", "double"]
    }
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs"
    }
  }
]);