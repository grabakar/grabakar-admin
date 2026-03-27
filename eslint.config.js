import tsParser from '@typescript-eslint/parser';

// Minimal ESLint flat config for CI.
// We intentionally keep `rules` empty: this is just a syntactic/type-aware lint gate.
export default [
  {
    files: ['src/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {},
  },
];

