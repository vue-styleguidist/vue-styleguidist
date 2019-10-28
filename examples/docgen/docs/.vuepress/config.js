const path = require('path')
const glob = require('globby')
const cwd = path.join(__dirname, '..')
const { parse } = require('vue-docgen-api')

module.exports = async () => {
	const docFiles = glob.sync('components/**/*.md', { cwd }).map(f => '/' + f)
	const components = await Promise.all(
		glob
			.sync('../src/components/**/*.{vue,js,jsx,ts,tsx}', { cwd, absolute: true })
			.map(async path => {
				return {
					name: (await parse(path)).displayName.replace(/[^a-zA-Z0-9_]/g, ''),
					path
				}
			})
	)

	return {
		dest: path.join(__dirname, '../../dist'),
		base: '/docgen/',
		title: 'VuePress DocGen Live',
		themeConfig: {
			search: false,
			sidebar: docFiles
		},
		plugins: [
			['live'],
			[
				'@vuepress/register-components',
				{
					components
				}
			]
		]
	}
}
