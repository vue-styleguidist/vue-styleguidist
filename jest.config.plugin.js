module.exports = {
	...require('./jest.config'),
	testMatch: ['<rootDir>/packages/*/__e2e__/*.{js,ts}'],
	setupFiles: ['./test/jestsetup.plugin.js']
}
