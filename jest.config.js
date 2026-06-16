module.exports = {
	preset: 'jest-expo',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
	moduleNameMapper: {
		'^@/app/(.*)$': '<rootDir>/app/$1',
		'^@/pages/(.*)$': '<rootDir>/pages/$1',
		'^@/widgets/(.*)$': '<rootDir>/widgets/$1',
		'^@/features/(.*)$': '<rootDir>/features/$1',
		'^@/entities/(.*)$': '<rootDir>/entities/$1',
		'^@/shared/(.*)$': '<rootDir>/shared/$1',
		'^lucide-react-native$': '<rootDir>/shared/test/mocks/lucide-react-native.tsx',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?/.*|expo-router|@expo/vector-icons|react-native-svg|react-native-reanimated|@react-navigation/.*|lucide-react-native)',
	],
};
