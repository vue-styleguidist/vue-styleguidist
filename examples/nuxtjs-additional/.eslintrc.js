module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		parser: 'babel-eslint',
	},
	extends: ['eslint:recommended', 'plugin:vue/recommended', 'airbnb-base'],
	plugins: ['vue'],
	settings: {
		'import/resolver': {
			webpack: {
				config: './config/nuxt.config.js',
			},
		},
	},
	// add your custom rules here
	rules: {
		'max-len': ['error', { code: 80 }],
		'import/no-unresolved': 'off',
		'no-param-reassign': [
			'error',
			{
				props: true,
				ignorePropertyModificationsFor: [
					'state', // for vuex state
					'acc', // for reduce accumulators
					'e', // for e.returnvalue
					'config', // for nuxt config
				],
			},
		],
		'import/no-extraneous-dependencies': [
			'error',
			{
				optionalDependencies: ['test/setup.js'],
			},
		],
		'linebreak-style': ['error', 'windows'],
	},
};
