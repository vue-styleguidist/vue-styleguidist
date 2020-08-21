import { Parser, Node } from 'acorn'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsx = require('acorn-jsx')

const extendedParser = Parser.extend(jsx())

export default function getAst(code: string): Node {
	return extendedParser.parse(code, {
		ecmaVersion: 2019,
		sourceType: 'module'
	})
}
