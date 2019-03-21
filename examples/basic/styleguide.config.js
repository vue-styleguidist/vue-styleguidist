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
					exclude: modulePath =>
						/node_modules/.test(modulePath) &&
						!/regexpu-core/.test(modulePath) &&
						!/unicode-match-property-ecmascript/.test(modulePath) &&
						!/unicode-match-property-value-ecmascript/.test(modulePath) &&
						!/acorn-jsx/.test(modulePath) &&
						!/@znck[\\/]prop-types/.test(modulePath),
					use: {
						loader: 'babel-loader',
						options: {
							sourceType: 'unambiguous',
							presets: [
								[
									'@babel/preset-env',
									{
										useBuiltIns: 'usage',
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

		plugins: [new vueLoader.VueLoaderPlugin()]
	},
	usageMode: 'expand',
	exampleMode: 'expand',
	compilerConfig: {
		target: { ie: 11 }
	}
}
