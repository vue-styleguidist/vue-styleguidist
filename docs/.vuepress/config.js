const title = 'Vue Styleguidist';
const description = 'Isolated Vue component development environment with a living style guide';

module.exports = {
	dest: 'docs/dist',
	title,
	description,
	head: [
		['meta', { prefix: ogprefix, property: 'og:title', content: title }],
		['meta', { prefix: ogprefix, property: 'twitter:title', content: title }],
		['meta', { prefix: ogprefix, property: 'og:type', content: 'website' }],
		['meta', { prefix: ogprefix, property: 'og:description', content: description }],
		[
			'meta',
			{
				prefix: ogprefix,
				property: 'og:image',
				content:
					'https://raw.githubusercontent.com/vue-styleguidist/vue-styleguidist/master/assets/logo.png',
			},
		],
	],
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
