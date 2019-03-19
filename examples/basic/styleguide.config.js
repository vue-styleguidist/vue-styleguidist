const vueLoader = require('vue-loader')

module.exports = {
	title: 'Vue Styleguidist basic',
	components: 'src/components/**/[A-Z]*.vue',
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
					test: /\.js?$/,
					exclude: /node_modules/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'usage',
										targets: {
											chrome: '58',
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

		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	usageMode: 'expand',
	exampleMode: 'expand'
}
