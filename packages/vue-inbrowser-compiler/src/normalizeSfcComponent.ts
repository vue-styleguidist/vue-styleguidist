import { parseComponent, SFCDescriptor } from 'vue-template-compiler'
import walkes from 'walkes'
import getAst from './getAst'
import transformOneImport from './transformOneImport'

const buildStyles = function(styles: Array<{ content: string }>): string | undefined {
	let _styles = ''
	if (styles) {
		styles.forEach(it => {
			if (it.content) {
				_styles += it.content
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
	if (parts.script)
		parts.script.content = parts.script.content.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
	return parts
}

function injectTemplateAndParseExport(parts: SFCDescriptor) {
	const templateString = parts.template ? parts.template.content.replace(/`/g, '\\`') : undefined

	if (!parts.script) return `{\ntemplate: \`${templateString}\` }`

	let code = parts.script.content
	let preprocessing = ''
	let startIndex = -1
	let endIndex = -1
	let offset = 0
	walkes(getAst(code), {
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
		ImportDeclaration(node: undefined) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
		}
	})
	if (startIndex === -1) {
		throw new Error('Failed to parse single file component: ' + code)
	}
	let right = code.slice(startIndex + 1, endIndex - 1)
	return {
		preprocessing,
		component: `{\n  template: \`${templateString}\`,\n  ${right}}`,
		postprocessing: code.slice(endIndex)
	}
}

/**
 * Coming out of this function all SFC should be in the `new Vue()` format
 * it should as well have been stripped of exports and all imports should have been
 * transformed into requires
 */
export default function normalizeSfcComponent(code) {
	const parts = getSingleFileComponentParts(code)
	const extractedComponent = injectTemplateAndParseExport(parts)
	//console.log(extractedComponent.component)
	return {
		component: [
			extractedComponent.preprocessing,
			`new Vue(${extractedComponent.component});`,
			extractedComponent.postprocessing
		].join('\n'),
		style: buildStyles(parts.styles)
	}
}
