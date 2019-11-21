const vueLoader = require('vue-loader')

const docSiteUrl = process.env.DEPLOY_PRIME_URL || 'https://vue-styleguidist.github.io'

module.exports = {
	title: 'Vue Styleguidist jsx',
	components: 'src/components/**/[A-Z]*.jsx',
	defaultExample: true,
	ribbon: {
		text: 'Back to examples',
		url: `${docSiteUrl}/Examples.html`
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
	exampleMode: 'expand',
	styleguideDir: 'dist'
}
