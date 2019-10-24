/* eslint-disable no-console */
const glob = require('globby')
const path = require('path')
const { parse } = require('../')

async function testPerformanceOfParse() {
	const componentFiles = await glob(path.resolve(__dirname, './components/*/*.vue'))
	const start = process.hrtime()
	await Promise.all(
		componentFiles.map(async compFile => {
			try {
				return await parse(compFile, {
					jsx: /jsx/.test(compFile),
					alias: {
						'@mixins': path.resolve(__dirname, './mixins'),
						'@utils': path.resolve(__dirname, './utils')
					}
				})
			} catch (e) {
				console.error(compFile)
				console.error(e)
			}
		})
	)
	const final = process.hrtime(start)
	console.info(final[1] / 1000000)
}
testPerformanceOfParse()
