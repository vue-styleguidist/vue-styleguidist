const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
	entry: {
		app: './src/index.js'
	},
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
			},
			{
				resourceQuery: /blockType=docs/,
				loader: 'raw-loader'
			}
		]
	},
	plugins: [
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: 'index.html',
			inject: true
		})
	]
}
