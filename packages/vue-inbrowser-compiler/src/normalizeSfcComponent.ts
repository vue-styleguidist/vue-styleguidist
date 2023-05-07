import walkes from 'walkes'
import { parseComponent, isVue3, transformOneImport, EvaluableComponent } from 'vue-inbrowser-compiler-utils'
import getAst from './getAst'

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

export function parseScriptCode(code: string): {
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
		ExportNamedDeclaration(node: any, recurse: () => void, stop: () => void) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.declarations[0].init.start + offset
			endIndex = node.declaration.declarations[0].init.end + offset
			if (node.declarations) {
				renderFunctionStart = getRenderFunctionStart(node.declarations[0])
			}
			recurse()
		},
		//export default {}
		ExportDefaultDeclaration(node: any, recurse: () => void, stop: () => void) {
			preprocessing = code.slice(0, node.start + offset)
			startIndex = node.declaration.start + offset
			endIndex = node.declaration.end + offset
			renderFunctionStart = getRenderFunctionStart(node.declaration)
			recurse()
		},
		//module.exports = {}
		AssignmentExpression(node: any, recurse: () => void, stop: () => void) {
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
			recurse()
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
	if (renderFunctionStart > 0 && !isVue3) {
		renderFunctionStart += offset
		code = insertCreateElementFunction(
			code.slice(0, renderFunctionStart + 1),
			code.slice(renderFunctionStart + 1)
		)
		endIndex += JSX_ADDON_LENGTH
	}
	const component = code.slice(startIndex + 1, endIndex - 1)
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
	return `${before};const h = this.$createElement;${after}`
}

export function parseScriptSetupCode(code: string): string {
  const varNames:string[] = []
  let offset = 0
	walkes(getAst(code), {
    VariableDeclaration(node: any) {
      node.declarations.forEach((declaration: any) => {
        if (declaration.id.name) {
          // simple variable declaration
          varNames.push(declaration.id.name)
        } else if (declaration.id.properties) {
          // spread variable declaration
          // const { all:names } = {all: 'foo'}
          declaration.id.properties.forEach((p: any) => {
            varNames.push(p.value.name)
          })
        }
      })
    },
    FunctionDeclaration(node: any) {
      varNames.push(node.id.name)
    },
    ImportDeclaration(node: any) {
			const ret = transformOneImport(node, code, offset)
			offset = ret.offset
			code = ret.code
		}
  })

	return `setup(){
${code}
return {${varNames.join(',')}}
function defineProps(props){ return props;}
function defineEmits(){ return function emit() {}}
function defineExpose(){}
}`
}

/**
 * Coming out of this function all SFC should be in the `new Vue()` format
 * it should as well have been stripped of exports and all imports should have been
 * transformed into requires
 */
export default function normalizeSfcComponent(code: string, _parseComponent = parseComponent): EvaluableComponent {
	const { script, scriptSetup, template, styles } = _parseComponent(code)

	const {
		preprocessing = '',
		component = '',
		postprocessing = ''
	} = scriptSetup
		? {
      preprocessing: script?.content || '',  
      component: parseScriptSetupCode(scriptSetup.content)
    }
		: script
		? parseScriptCode(script.content)
		: {}

	return {
		template: template?.content,
		script: [preprocessing, `return {${component}}`, postprocessing].join('\n'),
		style: buildStyles(styles.map(styleBlock => styleBlock.content)),
		setup: !!scriptSetup
	}
}
