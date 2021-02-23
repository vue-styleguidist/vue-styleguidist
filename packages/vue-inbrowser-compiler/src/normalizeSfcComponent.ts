/* eslint-disable no-case-declarations */
import {
	SyntaxKind,
	transpileModule,
	forEachChild,
	Node,
	ModuleKind,
	SourceFile,
	isExportAssignment,
	isVariableStatement,
	isExpressionStatement,
	isBinaryExpression,
	isPropertyAccessExpression,
	isIdentifier,
	isImportDeclaration,
	isObjectLiteralExpression,
	isMethodDeclaration,
	ObjectLiteralExpression,
	MethodDeclaration
} from 'typescript'
import { parseComponent } from 'vue-inbrowser-compiler-utils'
import getAst from './getAst'
import transformOneImport from './transformOneImport'
import { VsgSFCDescriptorLanguage } from '../../vue-inbrowser-compiler-utils/src/parseComponent'

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

function getSingleFileComponentParts(code: string): VsgSFCDescriptorLanguage {
	const parts = parseComponent(code)
	if (parts.script) {
		parts.script = parts.script.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
	}
	return {
		scriptLanguage: code.includes('lang="ts"') ? 'typescript' : 'javascript',
		...parts
	}
}

function injectTemplateAndParseExport(
	parts: VsgSFCDescriptorLanguage
): {
	preprocessing?: string
	component: string
	postprocessing?: string
} {
	const templateString = parts.template ? parts.template.replace(/`/g, '\\`') : undefined

	if (!parts.script) {
		return { component: `{template: \`${templateString}\` }` }
	}
	if (parts.scriptLanguage === 'typescript') {
		parts.script = transpileModule(parts.script, {
			compilerOptions: { module: ModuleKind.ES2015 }
		}).outputText
	}
	const comp = parseScriptCode(parts.script)
	if (templateString) {
		comp.component = `{template: \`${templateString}\`, ${comp.component}}`
	} else {
		comp.component = `{${comp.component}}`
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

	function walkes(sourceFile: SourceFile) {
		walkesNode(sourceFile)

		function walkesNode(node: Node) {
			if (isImportDeclaration(node)) {
				// transform import statements into require
				const ret = transformOneImport(node, code, offset)
				offset = ret.offset
				code = ret.code
			} else if (isExportAssignment(node) && isObjectLiteralExpression(node.expression)) {
				// export default {}
				preprocessing = code.slice(0, node.pos + offset)
				startIndex = node.expression.properties.pos + offset
				endIndex = node.expression.end + offset
				renderFunctionStart = getRenderFunctionStart(node.expression)

				return
			} else if (
				node.modifiers &&
				node.modifiers.some(mod => mod.kind === SyntaxKind.ExportKeyword) &&
				isVariableStatement(node)
			) {
				// export const MyComponent = {}
				preprocessing = code.slice(0, node.pos + offset)
				const initializer = node.declarationList.declarations[0].initializer
				if (initializer && isObjectLiteralExpression(initializer)) {
					startIndex = initializer.properties.pos + offset
					endIndex = initializer.end + offset
					renderFunctionStart = getRenderFunctionStart(initializer)
				}
				return
			} else if (isExpressionStatement(node) && isBinaryExpression(node.expression)) {
				if (
					(isPropertyAccessExpression(node.expression.left) &&
						isIdentifier(node.expression.left.expression) &&
						node.expression.left.expression.escapedText === 'module' &&
						isIdentifier(node.expression.left.name) &&
						node.expression.left.name.escapedText === 'exports') ||
					(isIdentifier(node.expression.left) && node.expression.left.escapedText === 'exports')
				) {
					// module.exports = {}
					if (isObjectLiteralExpression(node.expression.right)) {
						preprocessing = code.slice(0, node.expression.pos + offset)
						startIndex = node.expression.right.properties.pos + offset
						endIndex = node.expression.right.end + offset
					}
					return
				}
			}
			forEachChild(node, walkesNode)
		}
	}

	walkes(getAst(code))

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
	if (code.includes('Vue.extend({')) {
		startIndex = startIndex + 12
	}

	const component = code.slice(startIndex + 1, endIndex - (code.includes('Vue.extend') ? 2 : 1))
	console.log(component)
	return {
		preprocessing,
		component,
		postprocessing: code.slice(endIndex)
	}
}

export const JSX_ADDON_LENGTH = 31

export function getRenderFunctionStart(objectExpression: ObjectLiteralExpression): number {
	if (objectExpression && objectExpression.properties) {
		const nodeProperties = objectExpression.properties
		const renderFunctionObj = nodeProperties.find(
			p => isMethodDeclaration(p) && isIdentifier(p.name) && p.name.escapedText === 'render'
		) as MethodDeclaration | undefined
		if (renderFunctionObj && renderFunctionObj.body) {
			return renderFunctionObj.body.statements.pos
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
export default function normalizeSfcComponent(code: string): { script: string; style?: string } {
	const parts = getSingleFileComponentParts(code)
	const extractedComponent = injectTemplateAndParseExport(parts)
	return {
		script: [
			extractedComponent.preprocessing,
			`return ${extractedComponent.component}`,
			extractedComponent.postprocessing
		].join(';'),
		style: buildStyles(parts.styles)
	}
}
