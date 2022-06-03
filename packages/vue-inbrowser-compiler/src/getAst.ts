import { Parser, Node } from 'acorn'
// @ts-ignore this type is defined in react-styleguidist
import jsx from 'acorn-jsx'

const extendedParser = Parser.extend(jsx())

export default function getAst(code: string): Node {
	return extendedParser.parse(code, {
		ecmaVersion: 2019,
		sourceType: 'module'
	})
}
