module.exports = {
	...require('./jest.config'),
	testMatch: ['<rootDir>/packages/vue-cli-plugin-styleguidist/__e2e__/*.js'],
	setupFiles: ['./test/jestsetup.plugin.js']
}
