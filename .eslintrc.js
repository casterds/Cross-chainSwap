module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@next/next/recommended',
    'prettier' // Add "prettier" last. This will turn off eslint rules conflicting with prettier. This is not what formats the code.
  ],
  rules: {
  },
  env: {
    browser: true,
    node: true,
    jasmine: true,
  },
}
