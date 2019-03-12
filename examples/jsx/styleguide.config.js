const vueLoader = require('vue-loader')

module.exports = {
	title: 'Vue Styleguidist jsx',
	components: 'src/components/**/[A-Z]*.jsx',
	defaultExample: true,
	ribbon: {
		url: 'https://github.com/vue-styleguidist/vue-styleguidist'
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
					test: /\.(jsx|js)$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
							plugins: ['transform-vue-jsx']
						}
					}
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader']
				}
			]
		},

		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	usageMode: 'expand',
	exampleMode: 'expand'
}
