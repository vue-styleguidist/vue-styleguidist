import rewriteImports from './rewriteImports'

export default function transformOneImport(node: any, code: string, offset: number) {
	const start = node.start + offset
	const end = node.end + offset

	const statement = code.substring(start, end)
	let transpiledStatement = rewriteImports(statement, offset)

	code = code.substring(0, start) + transpiledStatement + code.substring(end)

	offset += transpiledStatement.length - statement.length
	return { code, offset }
}
