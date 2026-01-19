const { defineConfig } = require('eslint/config');
const expo = require('eslint-config-expo/flat');
const tsParser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const reactPlugin = require('eslint-plugin-react');
const reactNativePlugin = require('eslint-plugin-react-native');
const unusedImports = require('eslint-plugin-unused-imports');
const prettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
	expo,
	prettierRecommended,
	{
		files: ['**/*.{ts,tsx}'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},

		plugins: {
			'@typescript-eslint': tsPlugin,
			react: reactPlugin,
			'react-native': reactNativePlugin,
			'unused-imports': unusedImports,
		},

		settings: {
			react: {
				version: 'detect',
			},
		},

		rules: {
			/* ---------------- TS ---------------- */
			'@typescript-eslint/consistent-type-imports': ['warn', { prefer: 'type-imports' }],

			/* ---------------- React ---------------- */
			'react/jsx-uses-react': 'off',
			'react/react-in-jsx-scope': 'off',

			/* ---------------- Hooks ---------------- */
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',

			/* ---------------- React Native ---------------- */
			'react-native/no-inline-styles': 'warn',
			'react-native/no-unused-styles': 'warn',
			'react-native/split-platform-components': 'warn',

			/* ---------------- Imports ---------------- */
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'warn',
				{
					vars: 'all',
					varsIgnorePattern: '^_',
					args: 'after-used',
					argsIgnorePattern: '^_',
				},
			],

			/* ---------------- Prettier ---------------- */
			'prettier/prettier': 'warn',
		},
	},
	{
		ignores: ['node_modules/', '.expo/', 'dist/', 'build/'],
	},
]);
