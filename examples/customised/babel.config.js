module.exports = {
	presets: ['@babel/preset-env'],
	plugins: ['@babel/plugin-transform-runtime'],
	comments: false,
	overrides: [
		{
			// only process jsx with react style for styleguide components
			include: ['**/styleguide/components/*.js'],
			plugins: ['@babel/plugin-transform-react-jsx']
		},
		{
			// For vue components process jsx with the vue style
			include: ['**/src/components/**/*.jsx'],
			plugins: ['transform-vue-jsx']
		}
	]
}
