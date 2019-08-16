const path = require('path')

module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	defaultExample: true,
	components: 'src/components/**/[A-Z]*.{vue,jsx}',
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	},
	styleguideDir: 'dist',
	// Override Styleguidist components
	styleguideComponents: {
		LogoRenderer: path.join(__dirname, 'styleguide/components/Logo'),
		StyleGuideRenderer: path.join(__dirname, 'styleguide/components/StyleGuideRenderer'),
		SectionsRenderer: path.join(__dirname, 'styleguide/components/SectionsRenderer')
	}
}
