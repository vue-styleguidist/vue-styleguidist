module.exports = {
	env: {
		browser: true
	},
	extends: ['eslint:recommended', 'plugin:vue/essential', 'plugin:@typescript-eslint/recommended'],
	parserOptions: {
		ecmaVersion: 12,
		parser: '@typescript-eslint/parser',
		sourceType: 'module'
	},
	plugins: ['vue', '@typescript-eslint'],
	rules: {},
	overrides: [
		{
			files: ['**/vue-simple-docgen-loader/**/*'],
			env: {
				browser: false,
				node: true
			},
			rules: {
				'@typescript-eslint/no-var-requires': 'off'
			}
		}
	]
}
