import walkes from 'walkes'
import { parseComponent, VsgSFCDescriptor } from 'vue-inbrowser-compiler-utils'
import getAst from './getAst'
import transformOneImport from './transformOneImport'
import JSXTransform from './jsxTransform'

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

function getSingleFileComponentParts(code: string) {
	const parts = parseComponent(code)
	if (parts.script) {
		parts.script = parts.script.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
	}
	return parts
}

function parseExport(
	parts: VsgSFCDescriptor,
	transform: (code?: string) => string | undefined = c => c
): {
	preprocessing?: string
	component: string
	postprocessing?: string
} {
	const script = transform(parts.script)
	if (!script) {
		return { component: `{}` }
	}

	const comp = parseScriptCode(script)

	comp.component = `{${comp.component}}`
	return comp
}

export function parseScriptCode(
	code: string
): {
	preprocessing?: string
	component: string
	postprocessing?: string
} {
	let preprocessing = ''
	let startIndex = -1
	let endIndex = -1
	let offset = 0
	const ast = getAst(code)
	walkes(ast, {
		//export const MyComponent = {}
		ExportNamedDeclaration(node: any) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.declarations[0].init.start + offset
			endIndex = node.declaration.declarations[0].init.end + offset
		},
		//export default {}
		ExportDefaultDeclaration(node: any) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.start + offset
			endIndex = node.declaration.end + offset
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
			}
		},
		// and transform import statements into require
		ImportDeclaration(node: any) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
		}
	})
	if (startIndex === -1) {
		throw new Error('Failed to parse single file component: ' + code)
	}
	const component = JSXTransform(
		code.slice(startIndex + 1, endIndex - 1),
		ast,
		'__h__',
		'__Fragment__',
		startIndex
	).code
	return {
		preprocessing,
		component,
		postprocessing: code.slice(endIndex)
	}
}

export function getRenderFunctionStart(objectExpression: any): number {
	if (objectExpression && objectExpression.properties) {
		const nodeProperties: any[] = objectExpression.properties
		const renderFunctionObj = nodeProperties.find(
			(p: any) => p.key && p.key.type === 'Identifier' && p.key.name === 'render'
		)
		if (renderFunctionObj && renderFunctionObj.value.body) {
			return renderFunctionObj.value.body.start
		}
	}
	return -1
}

/**
 * Coming out of this function all SFC should be in the `new Vue()` format
 * it should as well have been stripped of exports and all imports should have been
 * transformed into requires
 */
export default function normalizeSfcComponent(
	code: string,
	transform: (code?: string) => string | undefined = c => c
): { template?: string; script: string; style?: string } {
	const parts = getSingleFileComponentParts(code)
	const extractedComponent = parseExport(parts, transform)
	return {
		template: parts.template,
		script: [
			extractedComponent.preprocessing,
			`;return ${extractedComponent.component}`,
			extractedComponent.postprocessing
		].join(';'),
		style: buildStyles(parts.styles)
	}
}
