/* eslint-disable no-console */
const glob = require('globby')
const path = require('path')
const { parse } = require('../')

async function testPerformanceOfParse() {
	const componentFiles = await glob(path.resolve(__dirname, './components/*/*.vue'))
	const start = process.hrtime.bigint()
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
	const final = process.hrtime.bigint()
	return ((final - start) / 1000000n)
}
async function testPerformance100() {
	let i = 100
	let time = 0n
	while (i--) {
		const t = await testPerformanceOfParse()
		console.log(i, t)
		time += t
	}
	console.log(time / 100n)
}
testPerformance100()
