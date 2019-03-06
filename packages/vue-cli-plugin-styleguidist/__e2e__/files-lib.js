jest.setTimeout(20000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')

async function createAndInstall(name, options) {
	const project = await create(name, options, cwd)
	const pkg = JSON.parse(await project.read('package.json'))
	const updatedPkges = {
		...pkg,
		main: 'dist/YourLib.umd.js',
		unpkg: 'dist/YourLib.umd.min.js',
		jsDelivr: 'dist/YourLib.umd.min.js',
		files: ['dist', 'src'],
		peerDependencies: {
			vue: '^2.6.0'
		}
	}
	// mock install
	updatedPkges.devDependencies['vue-cli-plugin-styleguidist'] = '*'
	await project.write('package.json', JSON.stringify(updatedPkges, null, 2))
	return project
}

async function checkProject(project) {
	const pkg = JSON.parse(await project.read('package.json'))
	expect(pkg.main).toBe('dist/YourLib.umd.js')
}

test('invoke should create a config file', async () => {
	const project = await createAndInstall(`files-invoke-lib`, { plugins: {} })
	await project.run(`${require.resolve('@vue/cli/bin/vue')} invoke vue-cli-plugin-styleguidist`)
	checkProject(project)
})

test('create should create a config file', async () => {
	const project = await createAndInstall(`files-create-lib`, {
		plugins: { 'vue-cli-plugin-styleguidist': {} }
	})
	checkProject(project)
})
