module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },

  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  overrides: [
    {
      files: ["**/*.vue", "**/*.ts"],
      rules: {
        "no-unused-expressions": "off",
        "*": "warn",
      },
    },
  ],
  extends: ["@nuxtjs/eslint-config-typescript", "plugin:prettier/recommended"],
  plugins: [],
  rules: {
    "*": "warn",
    indent: "off",
    "no-tabs": "off",
    "vue/html-indent": "off",
  },
};
