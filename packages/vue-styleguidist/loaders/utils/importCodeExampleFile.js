const path = require('path')
const fs = require('fs')

/**
 * Extract example from file
 */
const importRE = /^\[import\]\(([./\w]+)\)/

module.exports = function importCodeExampleFile(example, mdPath, wp) {
	if (importRE.test(example.lang)) {
		const filePath = importRE.exec(example.lang)[1]
		const absoluteFilePath = path.resolve(path.dirname(mdPath), filePath)
		wp.addDependency(absoluteFilePath)
		example.content = fs.readFileSync(absoluteFilePath, 'utf8')
		example.lang = path.extname(filePath).slice(1)

		const folderPath = path.dirname(filePath)
		if (folderPath !== '.') {
			example.settings = { ...example.settings, importpath: folderPath }
		}
	}
	return example
}
