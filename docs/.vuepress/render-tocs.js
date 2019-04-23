const globby = require('globby')
const path = require('path')
const fs = require('fs')
const toc = require('markdown-toc')

const docsFolder = path.resolve(__dirname, '..')

module.exports = async function generate_toc() {
	const files = await globby(['*.md', 'docs/*.md'], { cwd: docsFolder })
	return Promise.all(
		files.map(file => {
			return new Promise((resolve, reject) => {
				const filePath = path.join(docsFolder, file)
				fs.readFile(filePath, { encoding: 'utf8' }, function(err, data) {
					fs.writeFile(
						filePath,
						toc.insert(data, file === 'Configuration.md' ? { maxdepth: 4 } : { maxdepth: 2 }),
						{ encoding: 'utf8' },
						function(err) {
							if (err) {
								reject(err)
							} else {
								console.log(`ToC updated for ${file}`)
								resolve()
							}
						}
					)
				})
			})
		})
	)
}
