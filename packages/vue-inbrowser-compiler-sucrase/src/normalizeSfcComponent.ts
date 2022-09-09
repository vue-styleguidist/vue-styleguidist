import walkes from 'walkes'
import { parseComponent, isVue3 } from 'vue-inbrowser-compiler-utils'
import getAst from './getAst'
import transformOneJSXSpread from './transformOneJSXSpread'

const buildStyles = function (styles: string[] | undefined): string | undefined {
	let _styles = ''
	if (styles) {
		styles.forEach(it => {
			if (it) {
				_styles += it
			}
		})
	}
	if (_styles !== '') {
		return _styles.trim()
	}
	return undefined
}

export function parseScriptCode(
	code: string,
	config: { objectAssign?: string } = {}
): {
	preprocessing?: string
	component: string
	postprocessing?: string
	isFunctional?: boolean
} {
	let preprocessing = ''
	let startIndex = -1
	let endIndex = -1
	let offset = 0
	let renderFunctionStart = -1
	const ast = getAst(code).program

	let isFunctional = false
	const setFunctionalComponent = (node: any) => {
		if (['ArrowFunctionExpression', 'FunctionDeclaration'].includes(node.type)) {
			isFunctional = true
		}
	}

	walkes(ast, {
		// export const MyComponent = {}
		ExportNamedDeclaration(node: any) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.declarations[0].init.start + offset
			endIndex = node.declaration.declarations[0].init.end + offset
			if (node.declarations) {
				renderFunctionStart = getRenderFunctionStart(node.declarations[0])
			}
			setFunctionalComponent(node.declaration.declarations[0])
		},
		//export default {}
		ExportDefaultDeclaration(node: any) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.start + offset
			endIndex = node.declaration.end + offset
			renderFunctionStart = getRenderFunctionStart(node.declaration)
			setFunctionalComponent(node.declaration)
		},
		//module.exports = {}
		AssignmentExpression(node: any) {
			if (
				/exports/.test(node.left.name) ||
				(node.left.object &&
					/module/.test(node.left.object.name) &&
					/exports/.test(node.left.property.name))
			) {
				preprocessing = code.slice(0, node.start + offset)
				startIndex = node.right.start + offset
				endIndex = node.right.end + offset
				setFunctionalComponent(node.right)
			}
		}
	})

	walkes(ast, {
		JSXOpeningElement(node: any) {
			if (node.attributes.some((attrNode: any) => attrNode.type === 'JSXSpreadAttribute')) {
				const ret = transformOneJSXSpread(node, code, offset, config)
				if (node.start + offset < startIndex) {
					offset += ret.offset
				} else if (node.end + offset < endIndex) {
					endIndex += ret.offset
				}
				code = ret.code
			}
		}
	})

	if (startIndex === -1) {
		throw new Error('Failed to parse single file component: ' + code)
	}
	if (renderFunctionStart > 0 && !isVue3) {
		renderFunctionStart += offset
		code = insertCreateElementFunction(
			code.slice(0, renderFunctionStart + 1),
			code.slice(renderFunctionStart + 1)
		)
		endIndex += JSX_ADDON_LENGTH
	}

	const component = isFunctional
		? `render: ${code.slice(startIndex, endIndex)}`
		: code.slice(startIndex + 1, endIndex - 1)

	return {
		preprocessing,
		component,
		postprocessing: code.slice(endIndex)
	}
}

export const JSX_ADDON_LENGTH = 31

export function getRenderFunctionStart(objectExpression: any): number {
	if (objectExpression && objectExpression.properties) {
		const nodeProperties: any[] = objectExpression.properties
		const renderFunctionObj = nodeProperties.find(
			(p: any) => p.key && p.key.type === 'Identifier' && p.key.name === 'render'
		)
		if (renderFunctionObj?.body) {
			return renderFunctionObj.body.start
		}
	}
	return -1
}

export function insertCreateElementFunction(before: string, after: string): string {
	return `${before};const h = this.$createElement;${after}`
}

/**
 * Coming out of this function all SFC should be in the `new Vue()` format
 * it should as well have been stripped of exports and all imports should have been
 * transformed into requires
 */
export default function normalizeSfcComponent(
	code: string,
	config: { objectAssign?: string } = {}
): { script: string; style?: string; template?: string } {
	const parts = parseComponent(code)
	const { preprocessing = '', component = '' } = parts.script
		? parseScriptCode(parts.script.content, config)
		: {}
	return {
		template: parts.template?.content,
		script: [preprocessing, `return {${component}}`].join(';'),
		style: buildStyles(parts.styles.map(styleBlock => styleBlock.content))
	}
}
