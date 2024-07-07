/* eslint-disable no-console */
import puppeteer from 'puppeteer'
import * as path from 'path'

const args = process.argv.slice(2)

let browser

process.on('unhandledRejection', reason => {
	console.log('Unhandled Promise rejection:', reason)
	if (browser) {
		browser.close().then(() => process.exit(1))
	}
	process.exit(1)
})

async function onerror(err) {
	console.error(err.stack)
	if (browser) {
		await browser.close()
	}
	process.exit(1)
}

const launchPuppeteer = async () => {
	browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] })
	const page = await browser.newPage()
	await page.setViewport({ width: 1024, height: 768 })
	page.on('error', onerror)
	page.on('pageerror', onerror)

	page.on('console', msg => {
		if (msg.type() !== 'clear') {
			console.log('PAGE LOG:', msg.text())
		}
	})

	const url = /https?/.test(args[0])
		? args[0]
		: `file://${path.resolve(`examples/${args[0]}/dist/index.html`)}`
	await page.goto(url)

	if (args[1]) {
		await page.screenshot({ path: args[1] })
	}

	await browser.close()
}

launchPuppeteer().catch(onerror)
