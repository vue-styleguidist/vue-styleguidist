const path = require('path')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

const cliPath = require.resolve('@vue/cli-service')
console.log(path.dirname(cliPath))
const webpackPath = require.resolve('webpack', { paths: [path.dirname(cliPath)] })
process.env.VSG_WEBPACK_PATH = webpackPath

/** @type import("vue-styleguidist").Config */
module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	defaultExample: true,
	components: 'src/components/**/[A-Z]*.{vue,jsx}',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	styleguideDir: 'dist',
	// Override Styleguidist components
	styleguideComponents: {
		LogoRenderer: path.join(__dirname, 'styleguide/components/Logo'),
		StyleGuideRenderer: path.join(__dirname, 'styleguide/components/StyleGuideRenderer'),
		SectionsRenderer: path.join(__dirname, 'styleguide/components/SectionsRenderer')
	}
}
