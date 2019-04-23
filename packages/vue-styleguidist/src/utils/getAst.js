import { parse } from 'acorn'

export default function getAst(code) {
	return parse(code, {
		ecmaVersion: 2019,
		sourceType: 'module'
	})
}
