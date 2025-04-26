module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:react/recommended"],
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "import"],  // Add 'import' plugin here
  rules: {
    "import/prefer-default-export": "off",  // Disable the prefer-default-export rule
  },
};