module.exports = {
	presets: ['@babel/env'],
	overrides: [
		{
			test: './src',
			presets: ['@vue/app']
		},
		{
			test: './styleguide',
			presets: ['@babel/react']
		}
	]
}
