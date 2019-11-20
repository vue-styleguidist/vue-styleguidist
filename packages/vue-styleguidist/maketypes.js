/* eslint-disable no-console */
/* eslint-disable compat/compat */
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

const schema = require(path.join(__dirname, './lib/scripts/schemas/config')).default

function render(filename) {
	const filepath = path.resolve(__dirname, `./templates/${filename}`)
	// eslint-disable-next-line no-undef
	return new Promise(resolve => {
		ejs.renderFile(filepath, { schema }, function(err, str) {
			if (err) {
				throw new Error(err)
			}
			fs.writeFile(
				path.resolve(__dirname, './src/types', filename.replace(/\.ejs$/, '')),
				str,
				'utf8',
				function(err) {
					if (err) {
						throw new Error(err)
					} else {
						console.log('The config master file has changed and types have been updated')
						resolve()
					}
				}
			)
		})
	})
}

render('StyleGuide.ts.ejs')
