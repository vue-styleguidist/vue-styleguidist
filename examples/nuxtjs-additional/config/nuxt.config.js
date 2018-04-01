const autoprefixer = require('autoprefixer');
const nodeExternals = require('webpack-node-externals');
const i18n = require('./nuxt.i18n.config.js').default;

module.exports = {
	srcDir: 'src/',
	head: {
		title: 'Nuxt styleguide example',
		meta: [
			{ charset: 'utf-8' },
			{
				name: 'viewport',
				content: 'width=device-width,initial-scale=1',
			},
			{
				hid: 'description',
				name: 'description',
				content: 'Nuxt styleguide example',
			},
		],
		link: [
			{
				rel: 'shortcut icon',
				type: 'image/x-icon',
				href: 'favicon.ico',
			},
		],
	},
	loading: { color: '#3B8070' },
	plugins: [],
	modules: ['bootstrap-vue/nuxt', '@nuxtjs/axios', i18n],
	css: [],
	build: {
		extend(config, { isDev, isClient, isServer }) {
			if (isDev && isClient) {
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js|vue)$/,
					loader: 'eslint-loader',
					exclude: /(node_modules)/,
				});
				config.module.rules.push({
					enforce: 'pre',
					test: /\.(js)$/,
					loader: 'jshint-loader',
					exclude: [/(node_modules)/, /(.nuxt)/],
				});
			}
			if (isServer) {
				config.externals = [
					nodeExternals({
						whitelist: [/es6-promise|\.(?!(?:js|json)$).{1,5}$/i, /^vue-awesome/],
					}),
				];
			}
		},
		vendor: ['babel-polyfill', 'eventsource-polyfill', 'promise.prototype.finally'],
		plugins: [],
		postcss: [autoprefixer()],
	},
};
