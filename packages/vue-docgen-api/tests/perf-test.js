/* eslint-disable no-console */
const glob = require('globby')
const path = require('path')
const { parse } = require('../')

async function testPerformanceOfParse(componentFiles) {
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
const ITERATIONS = 100n
async function testPerformance100() {
	let i = ITERATIONS
	let time = 0n
	const componentFiles = await glob('components/**/*.vue', {cwd: __dirname, absolute: true})

	while (i--) {
		const t = await testPerformanceOfParse(componentFiles)
		console.log("Case", ITERATIONS - i)
		time += t
	}
	console.log("Average :", time / ITERATIONS, "ms")
}
testPerformance100()
