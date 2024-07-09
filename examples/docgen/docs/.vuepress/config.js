const path = require('path')
const glob = require('globby')
const cwd = path.join(__dirname, '..')
const { parse } = require('vue-docgen-api')

module.exports = async () => {
	const sidebar = glob.sync('components/**/*.md', { cwd }).map(f => '/' + f)
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
		base: '/docgen/',
		head: [['link', { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]],
		dest: path.join(__dirname, '../../dist'),
		title: 'VuePress DocGen Live',
		themeConfig: {
			sidebar
		},
		plugins: [
			['live', { noSsr: true }][
				('@vuepress/register-components',
				{
					components
				})
			]
		]
	}
}
