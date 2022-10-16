const path = require('path')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

/** @type import("vue-styleguidist").Config */
module.exports = {
	title: 'Vue Design System',
	components: 'src/components/**/[A-Z]*.vue',
	version: require('./package.json').version,
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	/**
	 * Enabling the following option splits sections into separate views.
	 */
	pagePerSection: true,
	simpleEditor: true,
	template: {
		title: 'Example — Vue Design System',
		lang: 'en',
		trimWhitespace: true,
		head: {
			meta: [
				{
					name: 'viewport',
					content: 'width=device-width,initial-scale=1.0'
				},
				{
					name: 'format-detection',
					content: 'telephone=no'
				}
			]
		}
	},
	/**
	 * remove the component pathline
	 */
	getComponentPathLine: () => '',
	/**
	 * load the vueds color scheme
	 */
	theme: './styleguide/vueds-theme.ts',
	styles: './styleguide/vueds-styles.js',
	/**
	 * import the webpack config from the project. It might be useful to add
	 * a babel loader to get the jsx to work properly for custom components
	 */
	webpackConfig: require('./webpack.config'),
	/**
	 * We’re defining below JS and SCSS requires for the documentation.
	 */
	require: [
		/**
		 * load the custom font
		 */
		path.join(__dirname, 'styleguide/loadfont.js')
	],
	/**
	 * Make sure sg opens with props and examples visible
	 */
	usageMode: 'expand',
	exampleMode: 'expand',
	styleguideComponents: {
		ReactComponentRenderer: path.join(__dirname, 'styleguide/components/ReactComponent'),
		PlaygroundRenderer: path.join(__dirname, 'styleguide/components/Playground')
	},
	styleguideDir: 'dist',
	sections: [
		{
			name: 'Getting Started',
			content: './docs/getting-started.md',
			sectionDepth: 1
		},
		{
			name: 'Elements',
			content: './docs/elements.md',
			pagePerSection: true,
			components: './src/components/**/[A-Z]*.vue',
			sectionDepth: 2
		}
	]
}
