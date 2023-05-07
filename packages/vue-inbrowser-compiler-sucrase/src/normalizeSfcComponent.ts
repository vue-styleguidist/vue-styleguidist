import walkes from 'walkes'
import { parseComponent, isVue3, EvaluableComponent } from 'vue-inbrowser-compiler-utils'
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

export function parseScriptSetupCode(code: string): string {
  const varNames:string[] = []
	walkes(getAst(code), {
		ImportDeclaration(node: any) {
			if (node.specifiers.length === 0) {
				// import 'foo'
				return
			}
			if (node.specifiers[0].type === 'ImportDefaultSpecifier') {
				// import foo from 'foo'
				varNames.push(node.specifiers[0].local.name)
			} else if (node.specifiers[0].type === 'ImportSpecifier') {
				// import { foo } from 'foo'
				node.specifiers.forEach((specifier: any) => {
					varNames.push(specifier.local.name)
				})
			}
		},
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
export default function normalizeSfcComponent(
	code: string,
	config: { objectAssign?: string } = {}
): EvaluableComponent {
  const { script, scriptSetup, template, styles } = parseComponent(code)
	const {
		preprocessing = '',
		component = '',
	} = scriptSetup
		? {
      preprocessing: script?.content, 
      component: parseScriptSetupCode(scriptSetup.content)
    }
		: script
		? parseScriptCode(script.content)
		: {}
	return {
		template: template?.content,
		script: [preprocessing, `return {${component}}`].join(';'),
		style: buildStyles(styles.map(styleBlock => styleBlock.content)),
		setup: Boolean(scriptSetup?.content)
	}
}
