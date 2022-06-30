/* eslint-disable import/first */
import 'react-styleguidist/lib/client/polyfills'
import 'react-styleguidist/lib/client/styles'
import ReactDOM from 'react-dom'
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

const render = () => {
	// eslint-disable-next-line @typescript-eslint/no-var-requires,import/no-unresolved,import/extensions
	const styleguide = require('!!../loaders/styleguide-loader!./index.js')
	ReactDOM.render(
		renderStyleguide(styleguide, codeRevision),
		document.getElementById(styleguide.config.mountPointId)
	)
}

window.addEventListener('hashchange', render)
window.addEventListener('hashchange', scrollToOrigin)

// @ts-expect-error hot module replacement
if (module.hot) {
	console.log('module.hot', { module })

	// @ts-expect-error hot module replacement
	module.hot.accept('!!../loaders/styleguide-loader!./index.js', () => {
		console.log('module.revision')
		codeRevision += 1
		render()
	})
} else {
	console.log('module.cold')
}

render()
