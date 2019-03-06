module.exports = {
	...require('./jest.config'),
	testMatch: ['<rootDir>/packages/**/__e2e__/*.(ts|js)'],
	setupFiles: ['./test/jestsetup.plugin.js']
}
