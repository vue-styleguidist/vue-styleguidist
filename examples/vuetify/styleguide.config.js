const path = require('path')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
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
	require: [
		path.join(__dirname, 'config/global.requires.js'),
		path.join(__dirname, 'config/global.styles.scss')
	],
	renderRootJsx: path.join(__dirname, 'config/styleguide.root.js'),
	validExtends: fullFilePath => !/(?=node_modules)(?!node_modules\/vuetify)/.test(fullFilePath),
	usageMode: 'collapse',
	exampleMode: 'expand',
	styleguideDir: 'dist',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	}
}
