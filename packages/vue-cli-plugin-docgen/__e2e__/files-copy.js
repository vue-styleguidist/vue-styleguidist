jest.setTimeout(20000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')
const fs = require('fs')

beforeAll(() => {
	if (!fs.existsSync(cwd)) {
		fs.mkdirSync(cwd)
	}
})

async function createAndInstall(name, options) {
	const project = await create(name, options, cwd, false)
	// mock install
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['vue-cli-plugin-docgen'] = '*'
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	return project
}

function checkProject(project) {
	expect(project.has('docgen.config.js')).toBeTruthy()
}

test('invoke should create a config file', async () => {
	const project = await createAndInstall(`docgen-files-invoke`, { plugins: {} })
	await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-docgen`)
	checkProject(project)
})

test('create should create a config file', async () => {
	const project = await createAndInstall(`docgen-files-create`, {
		plugins: { 'vue-cli-plugin-docgen': {} }
	})
	expect(project.has('docgen.config.js')).toBeTruthy()
	checkProject(project)
})
