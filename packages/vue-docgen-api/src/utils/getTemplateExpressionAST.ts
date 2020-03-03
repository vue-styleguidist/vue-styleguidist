import buildParser from '../babel-parser'

const parser = buildParser({ plugins: ['typescript'] })

export default function getTemplateExpressionAST(expression: string) {
	try {
		// this allows for weird expressions like {[t]:val} to be parsed properly
		return parser.parse(/^\{/.test(expression.trim()) ? `(() => (${expression}))()` : expression)
	} catch (e) {
		throw Error(
			`Could not parse template expression:\n` + //
			`${expression}\n` + //
				`Err: ${e.message}`
		)
	}
}
