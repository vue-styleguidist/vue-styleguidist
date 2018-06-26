const path = require('path');
const vueLoader = require('vue-loader');

module.exports = {
	title: 'Vue Style Guide Example',
	navigation: true,
	ribbon: {
		url: 'https://github.com/vue-styleguidist/vue-styleguidist',
	},
	sections: [
		{
			name: 'Getting Started',
			content: 'docs/Getting-Started.md',
		},
		{
			name: 'Documentation',
			content: 'docs/Documentation.md',
			sections: [
				{
					name: 'Files',
					content: 'docs/Files.md',
					sections: [
						{
							name: 'First',
							content: 'docs/One.md',
							description: 'This is the first section description',
						},
						{
							name: 'Second File',
							content: 'docs/Two.md',
						},
					],
				},
			],
		},
		{
			name: 'Components',
			content: 'docs/Components.md',
			components: () => [
				'./src/components/Label/Label.vue',
				'./src/components/Placeholder/Placeholder.vue',
			],
		},
	],
	require: [path.join(__dirname, 'src/styles.css')],
	defaultExample: true,
	webpackConfig: env => ({
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
				},
				{
					test: /\.js?$/,
					exclude: /node_modules/,
					loader: 'babel-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		plugins: [
			new vueLoader.VueLoaderPlugin()
		],
		performance:
			env === 'development'
				? false
				: {
						maxAssetSize: 2685000, // bytes
						maxEntrypointSize: 2685000, // bytes
						hints: 'error',
				  },
	}),
};
