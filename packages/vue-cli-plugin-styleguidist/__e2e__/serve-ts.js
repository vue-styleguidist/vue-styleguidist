jest.setTimeout(80000)

const invoke = require('@vue/cli/lib/invoke')
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

async function createAndInstall(name, isClass) {
	const project = await create(name, { plugins: { 'vue-cli-plugin-styleguidist': {} } }, cwd, false)
	// mock install
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['vue-cli-plugin-styleguidist'] = '*'
	pkg.devDependencies['@vue/cli-plugin-typescript'] = '*'
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	await invoke('typescript', { classComponent: isClass }, project.dir)
	return project
}

test('serve with typescript', async () => {
	const project = await createAndInstall(`serve-ts`)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})

test('serve with typescript class', async () => {
	const project = await createAndInstall(`serve-ts-class`, true)
	await serve(
		() => project.run('vue-cli-service styleguidist'),
		async ({ helpers }) => {
			expect(await helpers.getText('h1[class^=rsg--logo]')).toMatch('Default Style Guide')
		}
	)
})
