module.exports = {
	dest: 'docs/dist',
	title: 'Vue Styleguidist',
	description: 'Isolated Vue component development environment with a living style guide',
	themeConfig: {
		repo: 'vue-styleguidist/vue-styleguidist',
		editLinks: true,
		docsDir: 'docs',
		sidebar: [
			'/GettingStarted',
			'/Documenting',
			['/Components', 'Locating Components'],
			'/Webpack',
			'/Cookbook',
			'/API',
			'/Configuration',
			'/CLI',
			'/Development',
		],
	},
};
