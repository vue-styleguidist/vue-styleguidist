const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'
const { defineConfig } = require('vue-styleguidist')

/** @type import("vue-styleguidist").Config */
module.exports = defineConfig({
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	defaultExample: true,
	components: 'src/components/**/[A-Z]*.vue',
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
	},
	styleguideDir: 'dist',
	minimize: false
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// }
})
