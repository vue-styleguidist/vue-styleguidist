const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const vueLoader = require('vue-loader')

module.exports = {
	title: 'Vue Styleguidist basic',
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	minimize: false,
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	},
	version: '1.1.1',
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js?$/,
					exclude: modulePath =>
						/node_modules/.test(modulePath) &&
						!/node_modules[\\/]regexpu-core/.test(modulePath) &&
						!/node_modules[\\/]unicode-match-property-ecmascript/.test(modulePath) &&
						!/node_modules[\\/]unicode-match-property-value-ecmascript/.test(modulePath) &&
						!/node_modules[\\/]acorn-jsx/.test(modulePath) &&
						!/node_modules[\\/]@znck[\\/]prop-types/.test(modulePath),
					use: {
						loader: 'babel-loader',
						options: {
							sourceType: 'unambiguous',
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'usage',
										corejs: 2,
										targets: {
											ie: '11'
										}
									}
								]
							],
							comments: false
						}
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},

		plugins: [new vueLoader.VueLoaderPlugin()].concat(
			process.argv.includes('--analyze') ? [new BundleAnalyzerPlugin()] : []
		)
	},
	usageMode: 'expand',
	exampleMode: 'expand',
	editorConfig: {
		theme: 'solarized dark'
	},
	compilerConfig: {
		target: { ie: 11 }
	},
	styleguideDir: 'dist'
}
