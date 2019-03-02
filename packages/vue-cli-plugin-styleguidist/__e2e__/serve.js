jest.setTimeout(40000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')
const serve = require('@vue/cli-test-utils/serveWithPuppeteer')

async function createAndInstall(name) {
	const project = await create(name, { plugins: { 'vue-cli-plugin-styleguidist': {} } }, cwd)
	// mock install
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['vue-cli-plugin-styleguidist'] = '*'
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	return project
}

test('serve', async () => {
	const project = await createAndInstall(`serve`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})

test('serve with moved config file', async () => {
	const project = await createAndInstall(`serve-moved`)
	const config = await project.read('styleguide.config.js')
	const newFileName = 'othername.config.js'
	await project.write(newFileName, config)
	await project.rm('styleguide.config.js')
	await serve(
		() => project.run(`vue-cli-service styleguidist --config ${newFileName}`),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})
