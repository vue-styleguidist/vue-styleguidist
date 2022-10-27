/* eslint-disable import/first */
import 'react-styleguidist/lib/client/polyfills'
import 'react-styleguidist/lib/client/styles'
import { createRoot, Root } from 'react-dom/client'
import { getParameterByName, hasInHash } from 'react-styleguidist/lib/client/utils/handleHash'
import renderStyleguide from './utils/renderStyleguide'

// Examples code revision to rerender only code examples (not the whole page) when code changes
// eslint-disable-next-line no-unused-vars
let codeRevision = 0

// Scrolls to origin when current window location hash points to an isolated view.
const scrollToOrigin = () => {
	const hash = window.location.hash
	if (hasInHash(hash, '#/') || hasInHash(hash, '#!/')) {
		// Extracts the id param of hash
		const idHashParam = getParameterByName(hash, 'id')

		// For default scroll scrollTop is the page top
		let scrollTop = 0

		if (idHashParam) {
			// Searches the node with the same id, takes his offsetTop
			// And with offsetTop, tries to scroll to node
			const idElement = document.getElementById(idHashParam)
			if (idElement && idElement.offsetTop) {
				scrollTop = idElement.offsetTop
			}
		}
		window.scrollTo(0, scrollTop)
	}
}

let root: Root

const render = () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-unresolved,import/extensions
	const styleguide = require('!!../loaders/styleguide-loader!./index.js')
	const container = document.getElementById(styleguide.config.mountPointId)
	if (!container) {
		throw new Error(`Could not find container with id "${styleguide.config.mountPointId}"`)
	}
	if (!root) {
		root = createRoot(container) // createRoot(container!) if you use TypeScript
	}
	root.render(renderStyleguide(styleguide, codeRevision))
}

window.addEventListener('hashchange', render)
window.addEventListener('hashchange', scrollToOrigin)

// @ts-expect-error hot module replacement
if (module.hot) {
	// @ts-expect-error hot module replacement
	module.hot.accept('!!../loaders/styleguide-loader!./index.js', () => {
		codeRevision += 1
		render()
	})
}

render()
