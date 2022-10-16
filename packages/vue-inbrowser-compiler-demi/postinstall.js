const path = require('path')
const { promises: fs } = require('fs')

function checkPeerDependency(pkg) {
	try {
		require.resolve(pkg)
	} catch (error) {
		throw new Error(`vue-inbrowser-compiler needs "${pkg}" as a peer dependency`)
	}
}

function getVuePackageVersion() {
	if (process.argv.indexOf('--vue2') !== -1) {
		return '2.x'
	} else if (process.argv.indexOf('--vue3') !== -1) {
		return '3.x'
	}
	try {
		const pkg = require('vue/package.json')
		return pkg.version
	} catch (error) {
		return 'unknown'
	}
}

async function updateIndexForVueVersion(version) {
	const dirPath = path.join(__dirname, version)
	const paths = await fs.readdir(dirPath)
	// eslint-disable-next-line compat/compat, no-undef
	await Promise.all(
		paths.map(async fileName => {
			const indexContent = await fs.readFile(path.join(dirPath, fileName), 'utf8')
			await fs.writeFile(path.join(__dirname, fileName), indexContent)
		})
	)
	console.log(`[vue-inbrowser-compiler-demi] set up using ${version}`)
}

const version = getVuePackageVersion()

if (version.startsWith('3.')) {
	checkPeerDependency('@vue/compiler-sfc')
	updateIndexForVueVersion('vue3')
} else if (version.startsWith('2.')) {
	checkPeerDependency('vue-template-compiler')
	updateIndexForVueVersion('vue2')
}
