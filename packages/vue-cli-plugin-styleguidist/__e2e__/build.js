jest.setTimeout(40000)

const create = require('@vue/cli-test-utils/createTestProject')
const path = require('path')

const cwd = path.resolve(__dirname, '../../../test/cli-packages')

async function createAndInstall(name) {
	const project = await create(name, { plugins: { 'vue-cli-plugin-styleguidist': {} } }, cwd)
	// mock install
	const pkg = JSON.parse(await project.read('package.json'))
	pkg.devDependencies['vue-cli-plugin-styleguidist'] = '*'
	await project.write('package.json', JSON.stringify(pkg, null, 2))
	return project
}

test('simple build', async () => {
	const project = await createAndInstall(`build`)
	const { stdout } = await project.run('vue-cli-service styleguidist:build')
	expect(stdout).toMatch('Style guide published')
	expect(project.has('styleguide/index.html')).toBeTruthy()
})

test('change styleguideDir folder', async () => {
	const project = await createAndInstall(`build-config-dir`)
	const config = await project.read('styleguide.config.js')
	// add a styleguideDir configuration
	await project.write(
		'styleguide.config.js',
		config.replace(/(module\.exports = \{)/, "$1\n  styleguideDir: 'dist',")
	)
	await project.run('vue-cli-service styleguidist:build')
	expect(project.has('styleguide/index.html')).not.toBeTruthy()
	expect(project.has('dist/index.html')).toBeTruthy()
})
