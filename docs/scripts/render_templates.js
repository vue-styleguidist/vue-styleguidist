const globby = require('globby')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const templateFolder = path.resolve(__dirname, '../templates')
const rootFolder = path.resolve(__dirname, '../..')
async function render() {
	const files = await globby('*.ejs', { cwd: templateFolder })
	files.forEach(filename => {
		const filepath = path.resolve(templateFolder, filename)
		ejs.renderFile(filepath, { globby, path, rootFolder, require }, function(err, str) {
			if (err) {
				throw new Error(err)
			}
			fs.writeFile(
				path.resolve(__dirname, '../', filename.replace(/\.ejs$/, '')),
				str,
				'utf8',
				function(err) {
					if (err) {
						throw new Error(err)
					} else {
						console.log('template generated:', filename)
					}
				}
			)
		})
	})
}

render()
