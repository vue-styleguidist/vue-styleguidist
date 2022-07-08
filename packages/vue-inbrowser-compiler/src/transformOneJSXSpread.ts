export default function transformOneJSXSpread(node: any, code: string, offset: number) {
	const start = node.start + offset
	const end = node.end + offset

	const statement = code.substring(start, end)
	const transpiledStatement = `<${node.name.name} {...__Concatenate__(${node.attributes.map((attrNode: any) => { 
    if(attrNode.type === 'JSXSpreadAttribute') {
      return `${code.substring(
        attrNode.argument.start + offset, 
        attrNode.argument.end + offset)}`
    }else{
      return `{${attrNode.name.name}:${attrNode.value.raw}}`
    }
  }).join(',')})} ${node.selfClosing? '/' : ''}>`

	code = code.substring(0, start) + transpiledStatement + code.substring(end)

	offset = transpiledStatement.length - statement.length
	return { code, offset }
}