const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	defaultExample: true,
	components: 'src/components/**/[A-Z]*.vue',
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	},
	styleguideDir: 'dist',
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	webpackConfig: {
		plugins: process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : []
	},
	codeSplit: true,
	skipComponentsWithoutExample: true
}
