import tseslint from 'typescript-eslint';
import stylex from '@stylexjs/eslint-plugin';
export default tseslint.config(
  { ignores: ['node_modules/**', 'dist/**', '.ssr/**', 'public/**', 'src/generated/**'] },
  ...tseslint.configs.recommended,
  { files: ['**/*.{ts,tsx}'], plugins: { '@stylexjs': stylex }, rules: {
    '@stylexjs/valid-styles': 'error', '@stylexjs/no-unused': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
  } },
);
