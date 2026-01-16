/** @type {import("prettier").Config} */
module.exports = {
	plugins: ['@trivago/prettier-plugin-sort-imports'],
	singleQuote: true,
	trailingComma: 'all',
	useTabs: true,
	semi: true,
	bracketSpacing: true,
	printWidth: 100,
	endOfLine: 'auto',
	importOrder: [
		'^react$',
		'^react-native$',
		'^expo($|/)',
		'^@react-navigation/(.*)$',

		'<BUILTIN_MODULES>',
		'<THIRD_PARTY_MODULES>',
		'<TYPES>',

		'^@/app/(.*)$',
		'^@/screens/(.*)$',
		'^@/widgets/(.*)$',
		'^@/features/(.*)$',
		'^@/entities/(.*)$',
		'^@/shared/(.*)$',

		'^\\.\\./(.*)$',
		'^\\./(.*)$',
	],
	importOrderParserPlugins: ['typescript', 'jsx', 'tsx', 'decorators-legacy'],
	importOrderSeparation: true,
	importOrderSortSpecifiers: true,
	importOrderCaseInsensitive: true,
};
