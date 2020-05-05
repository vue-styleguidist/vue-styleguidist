const { parse } = require('vue-docgen-api')
const { generate } = require('escodegen')
const toAst = require('to-ast')

module.exports = function loaderDocgen(source) {
	const callback = this.async()
	const cb = callback ? callback : () => null
	asyncLoader
		.call(this, source)
		.then(res => cb(undefined, res))
		.catch(e => {
			throw e
		})
}

async function asyncLoader() {
	const file = this.request.split('!').pop()
	try {
		const docs = await parse(file)
		return `
          if (module.hot) {
              module.hot.accept([])
          }
          module.exports = ${generate(toAst(docs))}`
	} catch (error) {
		this.emitError(error)
	}
}
