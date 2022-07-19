const path = require('path')
const fs = require('fs')

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

async function updateIndexForVueVersion(version) {
	// commonjs
	const indexContent = await fs.promises.readFile(path.join(__dirname, version, indexPath), 'utf8')
	fs.writeFile(path.join(__dirname, indexPath), indexContent, err => {
		if (err) {
			console.error(err)
		}
	})

	// esm
	const indexContentESM = await fs.promises.readFile(
		path.join(__dirname, version, indexPathESM),
		'utf8'
	)

	fs.writeFile(path.join(__dirname, indexPathESM), indexContentESM, err => {
		if (err) {
			console.error(err)
		}
	})
}

const version = getVuePackageVersion()

if (version.startsWith('3.')) {
	updateIndexForVueVersion('vue3')
} else if (version.startsWith('2.')) {
	updateIndexForVueVersion('vue2')
}
