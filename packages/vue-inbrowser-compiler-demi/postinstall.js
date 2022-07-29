const path = require('path')
const fs = require('fs')

function checkPeerDependency(pkg) {
	try {
		require.resolve(pkg)
	} catch (error) {
		throw new Error(`vue-inbrowser-compiler needs "${pkg}" as a peer dependency`)
	}
}

function getVuePackageVersion() {
	try {
		const pkg = require('vue/package.json')
		return pkg.version
	} catch (error) {
		return 'unknown'
	}
}
const indexPath = 'index.cjs.js'
const indexPathESM = 'index.esm.js'
const paths = [indexPath, indexPathESM]

function updateIndexForVueVersion(version) {
	paths.forEach(async filePath => {
		const indexContent = await fs.promises.readFile(path.join(__dirname, version, filePath), 'utf8')
		fs.writeFile(path.join(__dirname, filePath), indexContent, err => {
			if (err) {
				console.error(err)
			}
		})
	})
}

const version = getVuePackageVersion()

if (version.startsWith('3.')) {
	checkPeerDependency('@vue/compiler-sfc')
	updateIndexForVueVersion('vue3')
} else if (version.startsWith('2.')) {
	checkPeerDependency('vue-template-compiler')
	updateIndexForVueVersion('vue2')
}
