const compiler = require('vue-template-compiler')

const buildStyles = function(styles) {
	let _styles = ''
	if (styles) {
		styles.forEach(it => {
			if (it.content) {
				_styles += it.content
			}
		})
	}
	if (_styles !== '') {
		return `<style scoped>${_styles.trim()}</style>`
	}
	return undefined
}

const getSingleFileComponentParts = function(code) {
	const parts = compiler.parseComponent(code, { pad: 'line' })
	if (parts.script)
		parts.script.content = parts.script.content.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '$1')
	return parts
}

const injectTemplateAndParseExport = function(parts) {
	const templateString = parts.template.content.replace(/`/g, '\\`')

	if (!parts.script) return `{\ntemplate: \`${templateString}\` }`

	const code = parts.script.content
	let index = -1
	let startIndex = -1
	if (code.indexOf('module.exports') !== -1) {
		startIndex = code.indexOf('module.exports')
		index = code.indexOf('{', startIndex) + 1
	} else if (code.indexOf('exports.default') !== -1) {
		startIndex = code.indexOf('exports.default')
		index = code.indexOf('{', startIndex) + 1
	} else if (code.indexOf('export ') !== -1) {
		startIndex = code.indexOf('export ')
		index = code.indexOf('{', startIndex) + 1
	}
	if (index === -1) {
		throw new Error('Failed to parse single file component: ' + code)
	}
	let right = code.substr(index).trim()
	if (right[right.length - 1] === ';') {
		right = right.slice(0, -1)
	}
	return {
		preprocessing: code.substr(0, startIndex).trim(),
		component: `{\ntemplate: \`${templateString}\`,\n${right}`
	}
}

export function isSingleFileComponent(code) {
	try {
		const parts = compiler.parseComponent(code, { pad: 'line' })
		return parts.template !== null
	} catch (err) {
		return false
	}
}

export function transformSingleFileComponent(code) {
	const parts = getSingleFileComponentParts(code)
	const templateAdded = injectTemplateAndParseExport(parts)
	return {
		component: `
			${templateAdded.preprocessing}
			new Vue(${templateAdded.component});
		`,
		style: buildStyles(parts.styles)
	}
}
