module.exports = function (api) {
	api.cache(true);

	return {
		presets: ['babel-preset-expo'],
		plugins: [
			'expo-router/babel',
			[
				'module-resolver',
				{
					alias: {
						'@/app': './app',
						'@/screens': './screens',
						'@/widgets': './widgets',
						'@/features': './features',
						'@/entities': './entities',
						'@/shared': './shared',
					},
					extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
				},
			],
		],
	};
};
