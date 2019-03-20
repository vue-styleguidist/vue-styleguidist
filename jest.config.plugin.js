module.exports = {
	...require('./jest.config'),
	collectCoverage: false,
	testMatch: ['<rootDir>/packages/**/__e2e__/*.(ts|js)'],
	setupFiles: ['./test/jestsetup.plugin.js']
}
