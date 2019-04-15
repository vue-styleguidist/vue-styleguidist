const render_templates = require('./render_templates')
const render_tocs = require('./render-tocs')

async function exec() {
	await render_templates()
	await render_tocs()
}

exec()
