import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier';

export default tseslint.config(
  {
    files: ['**/generated/**', '**/prisma/generated/**', '**/prisma/runtime/**'],
    ignores: ['**/generated/**', '**/prisma/generated/**', '**/prisma/runtime/**', '**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-private-class-members': 'off',
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    ignores: [
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      'generated/**',
      'prisma/generated/**',
      'prisma/runtime/**',
      '*.d.ts',
      '*.js',
      '*.js.map',
      '*.test.ts',
      '*.spec.ts',
      '__tests__/**',
      'test/**',
      'tests/**',
      'prisma/index.d.ts',
      'prisma/runtime/**/*.d.ts',
      'generated/prisma/**',
      '**/generated/**',
      '**/prisma/generated/**',
      '**/prisma/runtime/**',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      prettier: prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-unused-private-class-members': 'off',
    },
  },
);
