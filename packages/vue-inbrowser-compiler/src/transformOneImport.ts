import rewriteImports from './rewriteImports'

export default function transformOneImport(node, code, offset) {
	const start = node.start + offset
	const end = node.end + offset

	const statement = code.substring(start, end)
	let transpiledStatement = rewriteImports(statement)

	code = code.substring(0, start) + transpiledStatement + code.substring(end)

	offset += transpiledStatement.length - statement.length
	return { code, offset }
}
