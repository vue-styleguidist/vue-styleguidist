const title = 'Vue Styleguidist'
const ogprefix = 'og: http://ogp.me/ns#'
const description = 'Isolated Vue component development environment with a living style guide'
const fs = require('fs')
const path = require('path')

const render = require('./render_templates')
const render_tocs = require('./render-tocs')

const titleShare = `${title} docs`

module.exports = async () => {
	await render()
	await render_tocs()
	return {
		dest: 'docs/dist',
		title,
		description,
		head: [
			['meta', { prefix: ogprefix, property: 'og:title', content: titleShare }],
			['meta', { prefix: ogprefix, property: 'twitter:title', content: titleShare }],
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
				...(fs.existsSync(path.resolve(__dirname, '../Examples.md')) ? ['/Examples'] : []),
				['/VueCLI3doc', '@vue/cli 3.X'],
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
}
