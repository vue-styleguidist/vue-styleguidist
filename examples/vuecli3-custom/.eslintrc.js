module.exports = {
	extends: ['plugin:vue/recommended'],
	rules: {
		'vue/max-attributes-per-line': 0,
		'vue/html-self-closing': 0,
		'vue/html-indent': ['warn', 'tab'],
		'vue/no-multiple-template-root': 0
	},
	overrides: [
		{
			files: ['styleguide/components/*.js'],
			extends: ['plugin:react/recommended'],
			parserOptions: {
				parser: 'babel-eslint',
				sourceType: 'module'
			},
			rules: {
				'import/no-unresolved': [
					'error',
					{
						commonjs: true,
						caseSensitive: true,
						ignore: ['rsg-components/', 'rsg-components-default/']
					}
				]
			},
			settings: {
				react: {
					version: 'detect'
				}
			}
		}
	]
}
