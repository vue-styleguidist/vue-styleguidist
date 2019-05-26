const { parse } = require('acorn')

module.exports = function getAst(code) {
	return parse(code, {
		ecmaVersion: 2019,
		sourceType: 'module'
	})
}
