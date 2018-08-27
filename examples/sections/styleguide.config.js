const path = require('path');
const vueLoader = require('vue-loader');

module.exports = {
	title: 'Vue Style Guide Example',
	pagePerSection: true,
	sections: [
		{
			name: 'Documentation',
			content: 'docs/Documentation.md',
			sections: [
				{
					name: 'Files',
					content: 'docs/Files.md',
					sections: [
						{
							name: 'First File',
							content: 'docs/One.md',
							description: 'This is the first section description',
							components: () => ['./src/components/Label/Label.vue'],
						},
						{
							name: 'Second File',
							content: 'docs/Two.md',
						},
					],
				},
				{
					name: 'Online documentation',
					href: 'https://github.com/vue-styleguidist/vue-styleguidist',
					external: true,
				},
			],
			sectionDepth: 2,
		},
		{
			name: 'Components',
			sections: [
				{
					name: 'Buttons',
					components: () => ['./src/components/Button/Button.vue'],
					exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
					usageMode: 'hide', // 'hide' | 'collapse' | 'expand'
				},
				{
					name: 'Fields',
					components: () => ['./src/components/Placeholder/Placeholder.vue'],
					exampleMode: 'expand', // 'hide' | 'collapse' | 'expand'
					usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
				},
				{
					name: 'Others',
					components: () => ['./src/components/RandomButton/RandomButton.vue'],
					exampleMode: 'collapse', // 'hide' | 'collapse' | 'expand'
					usageMode: 'collapse', // 'hide' | 'collapse' | 'expand'
				},
			],
			sectionDepth: 0,
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
		plugins: [new vueLoader.VueLoaderPlugin()],
		performance:
			env === 'development'
				? false
				: {
						maxAssetSize: 1685000, // bytes
						maxEntrypointSize: 1685000, // bytes
						hints: 'error',
				  },
	}),
};
