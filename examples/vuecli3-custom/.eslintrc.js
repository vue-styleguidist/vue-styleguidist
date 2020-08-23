module.exports = {
	extends: ['plugin:vue/recommended', 'prettier/vue', 'plugin:prettier/recommended'],
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
