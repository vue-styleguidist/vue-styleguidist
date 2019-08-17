const path = require('path')
const glob = require('globby')
const cwd = path.join(__dirname, '..')
const { parse } = require('vue-docgen-api')

const docFiles = glob.sync('components/**/*.md', { cwd }).map(f => '/' + f)
const components = glob
	.sync('../src/components/**/*.{vue,js,jsx,ts,tsx}', { cwd, absolute: true })
	.map(path => ({
		name: parse(path).displayName.replace(/[^a-zA-Z0-9_]/g, ''),
		path
	}))

module.exports = {
	dest: 'dist',
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
