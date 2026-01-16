const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Говорим Metro: svg — это исходник, а не ассет
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts.push('svg');

// Говорим Metro: чем трансформировать svg
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = config;
