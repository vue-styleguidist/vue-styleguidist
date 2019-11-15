import walkes from 'walkes'
import { parseComponent, VsgSFCDescriptor } from 'vue-inbrowser-compiler-utils'
import getAst from './getAst'
import transformOneImport from './transformOneImport'

const buildStyles = function(styles: string[] | undefined): string | undefined {
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
	if (parts.script) parts.script = parts.script.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
	return parts
}

function injectTemplateAndParseExport(
	parts: VsgSFCDescriptor
): {
	preprocessing?: string
	component: string
	postprocessing?: string
} {
	const templateString = parts.template ? parts.template.replace(/`/g, '\\`') : undefined

	if (!parts.script) return { component: `{\ntemplate: \`${templateString}\` }` }

	const comp = parseScriptCode(parts.script)
	if (templateString) {
		comp.component = `{\n  template: \`${templateString}\`,\n  ${comp.component}}`
	} else {
		comp.component = `{\n  ${comp.component}}`
	}
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
	let renderFunctionStart = -1
	walkes(getAst(code), {
		//export const MyComponent = {}
		ExportNamedDeclaration(node: any) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.declarations[0].init.start + offset
			endIndex = node.declaration.declarations[0].init.end + offset
			if (node.declarations) {
				renderFunctionStart = getRenderFunctionStart(node.declarations[0])
			}
		},
		//export default {}
		ExportDefaultDeclaration(node: any) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.start + offset
			endIndex = node.declaration.end + offset
			renderFunctionStart = getRenderFunctionStart(node.declaration)
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
	if (renderFunctionStart > 0) {
		renderFunctionStart += offset
		code = insertCreateElementFunction(
			code.slice(0, renderFunctionStart + 1),
			code.slice(renderFunctionStart + 1)
		)
		endIndex += JSX_ADDON_LENGTH
	}
	let component = code.slice(startIndex + 1, endIndex - 1)
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
		if (renderFunctionObj && renderFunctionObj.value.body) {
			return renderFunctionObj.value.body.start
		}
	}
	return -1
}

export function insertCreateElementFunction(before: string, after: string): string {
	return `${before}
const h = this.$createElement;${after}`
}

/**
 * Coming out of this function all SFC should be in the `new Vue()` format
 * it should as well have been stripped of exports and all imports should have been
 * transformed into requires
 */
export default function normalizeSfcComponent(code: string): { script: string; style?: string } {
	const parts = getSingleFileComponentParts(code)
	const extractedComponent = injectTemplateAndParseExport(parts)
	return {
		script: [
			extractedComponent.preprocessing,
			`;return ${extractedComponent.component}`,
			extractedComponent.postprocessing
		].join('\n'),
		style: buildStyles(parts.styles)
	}
}
