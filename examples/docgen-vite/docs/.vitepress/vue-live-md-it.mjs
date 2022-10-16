/// @ts-check
import { parse } from '@vue/compiler-sfc'

function addVueLive(md, opts) {
	const fence = md.renderer.rules.fence
	md.renderer.rules.fence = (...args) => {
		const [tokens, idx] = args
		const token = tokens[idx]
		const lang = token.info.trim()

		// if it does not ends with live just use default fence
		if (!/ live$/.test(lang) && !/ live /.test(lang)) {
			return fence(...args)
		}

		const getImports = code => {
			// script is at the beginning of a line after a return
			// In case we are loading a vue component as an example, extract script tag
			const { descriptor } = parse(code)
			if (descriptor) {
				const imports = Object.keys(descriptor?.script?.imports || {})
				return imports
			}
			return []
		}

		const code = token.content

		// analyze code to find requires
		// put all requires into a "requires" object
		// add this as a prop
		const imports = getImports(code)
		const requires = imports.map(mod => `'${mod}': require('${mod}')`)
		const langArray = lang.split(' ')
		const langClean = langArray[0]
		const codeClean = md.utils.escapeHtml(code).replace(/\`/g, '\\`').replace(/\$/g, '\\$')
		const editorProps = langArray.find(l => /^\{.+\}$/.test(l))
		const jsx = langArray.length > 2 && langArray[1] === 'jsx' ? 'jsx ' : '' // to enable jsx, we want ```vue jsx live or ```jsx jsx live
		const markdownGenerated = `<vue-live ${jsx}
      :layoutProps="{lang:'${langClean}'}" 
      :code="\`${codeClean}\`" 
      :requires="{${requires.join(',')}}"
      ${editorProps ? ` :editorProps="${editorProps}"` : ''}
       />`
		return markdownGenerated
	}
}

// Dirty hack to make `import anchor from 'markdown-it-anchor'` work with
// TypeScript which doesn't support the `module` field of `package.json` and
// will always get the CommonJS version which otherwise wouldn't have a
// `default` key, resulting in markdown-it-anchor being undefined when being
// imported that way.
addVueLive.default = addVueLive

export default addVueLive
