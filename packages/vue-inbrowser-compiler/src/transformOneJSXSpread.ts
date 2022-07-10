export default function transformOneJSXSpread(node: any, code: string, offset: number, config: { objectAssign?: string } ) {
	const start = node.start + offset
	const end = node.end + offset

  const objectAssign = config.objectAssign || 'Object.assign'

	const statement = code.substring(start, end)
	const transpiledStatement = `<${node.name.name} {...${objectAssign}(${node.attributes
		.map((attrNode: any) => {
			if (attrNode.type === 'JSXSpreadAttribute') {
				return `${code.substring(attrNode.argument.start + offset, attrNode.argument.end + offset)}`
			} else {
				return `{${attrNode.name.name}:${
					attrNode.value.type.endsWith('Literal')
						? JSON.stringify(attrNode.value.value)
						: code.substring(attrNode.value.expression.start + offset, attrNode.value.expression.end + offset)
				}}`
			}
		})
		.join(',')})} ${node.selfClosing ? '/' : ''}>`

	code = code.substring(0, start) + transpiledStatement + code.substring(end)

	offset = transpiledStatement.length - statement.length
	return { code, offset }
}
