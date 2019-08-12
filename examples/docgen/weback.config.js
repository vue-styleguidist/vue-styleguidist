const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
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
	plugins: [new VueLoaderPlugin()]
}
