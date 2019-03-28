const { resolve } = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
	components: './src/components/**/[A-Z]*.vue',
	renderRootJsx: resolve(__dirname, 'styleguide/styleguide.root.js'),
	webpackConfig: {
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader'
				},
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: require('./babel.config')
					}
				},
				{
					test: /\.css$/,
					use: ['vue-style-loader', 'css-loader']
				}
			]
		},
		plugins: [new VueLoaderPlugin()]
	},
	usageMode: 'expand',
	styleguideDir: 'dist'
}
