import walkes from 'walkes'

export default function JSXTransform(
	input: string,
	ast: acorn.Node,
	pragma: string,
	fragment: string,
	offset = 0,
	originalInput = input
): { code: string; offset: number } {
	let output = input
	walkes(ast, {
		JSXElement(node: any) {
			const code = getReplacementCode(node)
			const start = node.openingElement.start + offset - 1
			const end = (node.closingElement || node.openingElement).end + offset - 1
			output = output.slice(0, start) + code + output.slice(end)
			offset += code.length - (end - start)
		},
		JSXFragment(node: any) {
			const code = getReplacementCode(node)
			const start = node.start + offset - 1
			const end = node.end + offset - 1
			output = output.slice(0, start) + code + output.slice(end)
			offset += code.length - (end - start)
		}
	})
	return { code: output, offset }

	function getReplacementCode(node: any): string {
		if (node.type === 'JSXText') {
			return JSON.stringify(node.value)
		}
		if (node.type === 'JSXExpressionContainer') {
			return JSXTransform(
				originalInput.slice(node.expression.start, node.expression.end),
				node,
				pragma,
				fragment,
				1 - node.expression.start,
				originalInput
			).code
		}
		const params = [node.type === 'JSXFragment' ? fragment : node.openingElement.name.name]
		if (node.openingElement?.attributes.length) {
			params.push(getAttributes(node.openingElement.attributes))
		}

		if (node.children.length) {
			params.push(getChildren(node.children))
		}
		return `${pragma}(${params.join(',')})`
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
							? originalInput.slice(attr.value.expression.start, attr.value.expression.end)
							: 'hola'
					return `${attr.name.name}:${value}`
				} else if (attr.type === 'JSXSpreadAttribute') {
					return `...${originalInput.slice(attr.argument.start, attr.argument.end)}`
				}
				return 'null'
			})
			.join(',')}}`
	}
}
