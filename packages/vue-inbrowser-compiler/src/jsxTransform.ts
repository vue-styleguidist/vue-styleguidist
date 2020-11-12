import walkes from 'walkes'

export default function JSXTransform(
	input: string,
	JSXast: acorn.Node,
	offset: number
): { code: string; offset: number } {
	return fixAST(input, JSXast, offset)

	function fixAST(
		inputCode: string,
		ast: acorn.Node,
		globalOffset: number
	): { code: string; offset: number } {
		let output = inputCode
		walkes(ast, {
			JSXElement(node: any) {
				const code = getReplacementCode(node)
				const start = node.openingElement.start + globalOffset - 1
				const end = (node.closingElement || node.openingElement).end + globalOffset - 1
				output = output.slice(0, start) + code + output.slice(end)
				globalOffset += code.length - (end - start)
			},
			JSXFragment(node: any) {
				const code = getReplacementCode(node)
				const start = node.start + globalOffset - 1
				const end = node.end + globalOffset - 1
				output = output.slice(0, start) + code + output.slice(end)
				globalOffset += code.length - (end - start)
			}
		})
		return { code: output, offset: globalOffset }
	}

	function getReplacementCode(node: any): string {
		if (node.type === 'JSXText') {
			return JSON.stringify(node.value)
		}
		if (node.type === 'JSXExpressionContainer') {
			return fixAST(
				input.slice(node.expression.start, node.expression.end),
				node,
				1 - node.expression.start
			).code
		}
		const params = [node.type === 'JSXFragment' ? '_Fragment' : node.openingElement.name.name]
		if (node.openingElement?.attributes.length) {
			params.push(getAttributes(node.openingElement.attributes))
		}

		if (node.children.length) {
			params.push(getChildren(node.children))
		}
		return `h(${params.join(',')})`
	}

	function getChildren(children: any[]): string {
		return `[${children.map(child => getReplacementCode(child)).join(',')}]`
	}

	function getAttributes(attributes: any[]): string {
		return `{${attributes
			.map(attr => {
				if (attr.type === 'JSXAttribute') {
					const value =
						attr.value.type === 'JSXExpressionContainer'
							? input.slice(attr.value.expression.start, attr.value.expression.end)
							: 'hola'
					return `${attr.name.name}:${value}`
				} else if (attr.type === 'JSXSpreadAttribute') {
					return `...${input.slice(attr.argument.start, attr.argument.end)}`
				}
				return 'null'
			})
			.join(',')}}`
	}
}
