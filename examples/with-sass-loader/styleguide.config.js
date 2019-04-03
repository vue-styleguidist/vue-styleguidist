const path = require('path')
const vueLoader = require('vue-loader')

module.exports = {
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	require: [path.join(__dirname, './src/style.scss')],
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	},
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					options: {
						loaders: {
							scss: ['vue-style-loader', 'css-loader', 'sass-loader']
						}
					}
				},
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},
				{
					test: /\.(css?|scss)(\?.*)?$/,
					loader: 'style-loader!css-loader!sass-loader'
				}
			]
		},
		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	usageMode: 'expand',
	exampleMode: 'expand',
	styleguideDir: 'dist'
}
