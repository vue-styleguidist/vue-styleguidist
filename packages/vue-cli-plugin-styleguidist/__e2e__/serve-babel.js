const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')
const fs = require('fs')

beforeAll(() => {
	if (!fs.existsSync(cwd)) {
		fs.mkdirSync(cwd)
	}
})
const serve = require('@vue/cli-test-utils/serveWithPuppeteer')

async function createAndInstall(name) {
	const project = await create(name, { plugins: { 'vue-cli-plugin-styleguidist': {} } }, cwd, false)
	// mock install
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['vue-cli-plugin-styleguidist'] = '*'
	pkg.devDependencies['@vue/cli-plugin-babel'] = '*'
	pkg.devDependencies['@vue/cli-plugin-eslint'] = '*'
	pkg.devDependencies['@babel/eslint-parser'] = '*'
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
			parser: '@babel/eslint-parser'
		}
	}
	pkg['browserslist'] = ['> 1%', 'last 2 versions', 'not ie <= 8']
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	await project.write(
		'babel.config.js',
		['module.exports = {', "	presets: ['@vue/app']", '}'].join('\n')
	)
	const setupCode = await fs.promises.readFile(
		path.resolve(__dirname, '../__samples__/setupEnv.js'),
		'utf8'
	)
	await project.write('setupEnv.js', setupCode)
	const styleguideConfig = await project.read('styleguide.config.js')
	await project.write('styleguide.config.js', `require('./setupEnv')\n${styleguideConfig}`)
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
