module.exports = {
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	moduleFileExtensions: ['ts', 'js'],
	testMatch: ['<rootDir>/tests/**/*.test.(ts|js)', '<rootDir>/src/**/__tests__/**/*.(ts|js)'],
};
