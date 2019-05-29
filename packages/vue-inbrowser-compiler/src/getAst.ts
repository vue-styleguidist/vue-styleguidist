import { parse, Node } from 'acorn'

export default function getAst(code: string): Node {
	return parse(code, {
		ecmaVersion: 2019,
		sourceType: 'module'
	})
}
