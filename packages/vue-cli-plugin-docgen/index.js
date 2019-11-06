const { default: docgen, extractConfig } = require('vue-docgen-cli')

module.exports = api => {
	api.configureWebpack(() => ({
		// make sure that the docs blocks
		// are ignored during normal serve & build
		module: {
			rules: [
				{
					resourceQuery: /blockType=docs/,
					loader: 'null-loader'
				}
			]
		}
	}))

	api.registerCommand(
		'docgen',
		{
			description: 'compiles the markdown files with your components',
			usage: 'vue-cli-service docgen [options]',
			options: {
				'--config': 'path to the config file'
			}
		},
		() => {
			docgen(extractConfig(api.getCwd()))
		}
	)

	api.registerCommand(
		'docgen:watch',
		{
			description: 'compiles the markdown files with your components in watch mode',
			usage: 'vue-cli-service docgen:watch [options]',
			options: {
				'--config': 'path to the config file'
			}
		},
		() => {
			docgen({ ...extractConfig(api.getCwd()), watch: true })
		}
	)
}
