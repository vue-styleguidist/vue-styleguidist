jest.setTimeout(30000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')
const serve = require('@vue/cli-test-utils/serveWithPuppeteer')

async function createAndInstall(name) {
	const project = await create(name, { plugins: { 'vue-cli-plugin-styleguidist': {} } }, cwd, false)
	// mock install
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['vue-cli-plugin-styleguidist'] = '*'
	pkg.devDependencies['@vue/cli-plugin-babel'] = '*'
	pkg.devDependencies['@vue/cli-plugin-eslint'] = '*'
	pkg.devDependencies['babel-eslint'] = '*'
	pkg.devDependencies['eslint'] = '*'
	pkg.devDependencies['eslint-plugin-vue'] = '*'
	pkg['eslintConfig'] = {
		root: true,
		env: {
			node: true
		},
		extends: ['plugin:vue/essential', 'eslint:recommended'],
		rules: {},
		parserOptions: {
			parser: 'babel-eslint'
		}
	}
	pkg['browserslist'] = ['> 1%', 'last 2 versions', 'not ie <= 8']
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	await project.write(
		'babel.config.js',
		['module.exports = {', "	presets: ['@vue/app']", '}'].join('\n')
	)
	return project
}

test('serve with babel', async () => {
	const project = await createAndInstall(`serve-babel`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})
