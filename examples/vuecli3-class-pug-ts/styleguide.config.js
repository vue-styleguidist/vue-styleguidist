module.exports = {
	// set your styleguidist configuration here
	title: 'Default Style Guide',
	components: 'src/components/**/[A-Z]*.vue',
	defaultExample: true,
	// sections: [
	//   {
	//     name: 'First Section',
	//     components: 'src/components/**/[A-Z]*.vue'
	//   }
	// ],
	// webpackConfig: {
	//   // custom config goes here
	// }
	ribbon: {
		text: 'Back to examples',
		url: 'https://vue-styleguidist.github.io/Examples.html'
	},
	styleguideDir: 'dist'
}
