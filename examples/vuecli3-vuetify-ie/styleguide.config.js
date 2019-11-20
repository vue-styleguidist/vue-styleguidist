const path = require('path')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
	title: 'IE - Vuetlfy Styleguide',
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	template: {
		head: {
			links: [
				{
					href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
					rel: 'stylesheet'
				}
			]
		}
	},
	require: [path.join(__dirname, 'config/global.requires.js')],
	renderRootJsx: path.join(__dirname, 'config/styleguide.root.js'),
	usageMode: 'expand',
	exampleMode: 'expand',
	styleguideDir: 'dist',
	compilerConfig: {
		target: { ie: 11 }
	},
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	}
}
