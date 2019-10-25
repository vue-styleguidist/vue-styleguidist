const { copyFile } = require('fs')
const { promisify } = require('util')
const { resolve } = require('path')
const render_templates = require('./render_templates')
const render_tocs = require('./render-tocs')

const copy = promisify(copyFile)

async function exec() {
	await copy(
		resolve(__dirname, '../../packages/vue-docgen-cli/README.md'),
		resolve(__dirname, '../docs/docgen-cli.md')
	)
	await render_templates()
	await render_tocs()
}

exec()
