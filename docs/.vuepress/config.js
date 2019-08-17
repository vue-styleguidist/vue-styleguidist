const title = 'Vue Styleguidist'
const ogprefix = 'og: http://ogp.me/ns#'
const description = 'Isolated Vue component development environment with a living style guide'
const fs = require('fs')
const path = require('path')

const titleShare = `${title} docs`

module.exports = () => {
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
		plugins: [
			[
				'@vuepress/google-analytics',
				{
					ga: 'UA-142169574-1'
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
			nav: [
				{ text: 'Docs', link: '/docs/GettingStarted' },
				...(fs.existsSync(path.resolve(__dirname, '../Examples.md'))
					? [{ text: 'Examples', link: '/Examples' }]
					: []),
				{ text: 'Vue CLI Plugin', link: '/VueCLI3doc' },
				{ text: 'Reference', link: '/Configuration' }
			],
			sidebar: {
				'/docs/': [
					['/docs/GettingStarted', 'Getting Started'],
					'/docs/Documenting',
					['/docs/Components', 'Locating Components'],
					'/docs/Webpack',
					'/docs/Cookbook',
					'/docs/CLI',
					'/docs/API',
					'/docs/Deployment',
					'/docs/Docgen',
					'/docs/Development'
				],
				'/Configuration': ['/Configuration'],
				'/Examples': ['/Examples']
			}
		}
	}
}
