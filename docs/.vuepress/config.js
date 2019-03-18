const title = 'Vue Styleguidist'
const ogprefix = 'og: http://ogp.me/ns#'
const description = 'Isolated Vue component development environment with a living style guide'

module.exports = {
	dest: 'docs/dist',
	title,
	description,
	head: [
		['meta', { prefix: ogprefix, property: 'og:title', content: title }],
		['meta', { prefix: ogprefix, property: 'twitter:title', content: title }],
		['meta', { prefix: ogprefix, property: 'og:type', content: 'website' }],
		['meta', { prefix: ogprefix, property: 'og:description', content: description }],
		[
			'meta',
			{
				prefix: ogprefix,
				property: 'og:image',
				content:
					'https://raw.githubusercontent.com/vue-styleguidist/vue-styleguidist/master/assets/logo.png'
			}
		]
	],
	themeConfig: {
		repo: 'vue-styleguidist/vue-styleguidist',
		editLinks: true,
		docsDir: 'docs',
		algolia: {
			apiKey: '27d4fa7b11db706f186d098352d5ae3e',
			indexName: 'vue-styleguidist'
		},
		sidebar: [
			'/GettingStarted',
			['/VueCLI3', '@vue/cli 3.X'],
			'/Documenting',
			['/Components', 'Locating Components'],
			'/Webpack',
			'/Cookbook',
			'/API',
			['/Docgen', 'vue-docgen-api'],
			'/Configuration',
			'/CLI',
			'/Development'
		]
	}
}
