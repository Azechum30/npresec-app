import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";

/** @type {import("eslint").Linter.Config[]} */
const config = [
  ...nextCoreWebVitals,
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules,
      ...hooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/incompatible-library": "off",
    },
  },
];

export default config;
