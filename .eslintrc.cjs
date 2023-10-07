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
  extends: [
    "@nuxtjs/eslint-config-typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  overrides: [
    {
      files: ["src/**/*.*"],
      rules: {
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "no-useless-escape": "warn",
        "no-empty": "warn",
      },
    },
  ],
  plugins: ["prettier"],
};
