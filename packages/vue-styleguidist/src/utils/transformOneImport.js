import rewriteImports from 'rewrite-imports'

export default function transformOneImport(node, code, offset) {
	const start = node.start + offset
	const end = node.end + offset

	const statement = code.substring(start, end)
	const transpiledStatement = rewriteImports(statement)

	code = code.substring(0, start) + transpiledStatement + code.substring(end)

	offset += transpiledStatement.length - statement.length
	return { code, offset }
}
