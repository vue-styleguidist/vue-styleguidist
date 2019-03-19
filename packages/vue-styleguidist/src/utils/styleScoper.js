/* eslint-disable no-control-regex */

// used to make CSS selectors remain scoped properly
function init() {
	const style = document.createElement('style')
	style.appendChild(document.createTextNode(''))
	document.head.appendChild(style)
	style.sheet.insertRule('body { visibility: hidden; }', 0)
}

export function scoper(css, suffix) {
	const re = /([^\r\n,{}]+)(,(?=[^}]*{)|s*{)/g

	// `after` is going to contain eithe a comma or an opening curly bracket
	css = css.replace(re, function(full, selector, after) {
		// if non-rule delimiter
		if (selector.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
			return selector + after
		}

		// deal with :scope pseudo selectors
		if (selector.match(/:scope/)) {
			selector = selector.replace(/([^\s]*):scope/, function(full, cutSelector) {
				if (cutSelector === '') {
					return '> *'
				}
				return '> ' + cutSelector
			})
		}

		// deal with other pseudo selectors
		let pseudo = ''
		if (selector.match(/:/)) {
			const parts = selector.split(/:/)
			selector = parts[0]
			pseudo = ':' + parts[1]
		}

		selector = selector.trim() + ' '
		selector = selector.replace(/ /g, suffix + pseudo + ' ')

		return selector + after
	})

	return css
}

function process() {
	const styles = document.body.querySelectorAll('style[scoped]')

	if (styles.length === 0) {
		document.getElementsByTagName('body')[0].style.visibility = 'visible'
		return
	}

	const head = document.head || document.getElementsByTagName('head')[0]
	const newstyle = document.createElement('style')
	newstyle.dataset.cssscoper = 'true'
	let csses = ''

	let idx
	for (idx = 0; idx < styles.length; idx++) {
		const style = styles[idx]
		const moduleId = style.id
		const css = style.innerHTML

		if (css && style.parentElement.nodeName !== 'BODY') {
			const suffix = '[' + moduleId + ']'
			style.parentNode.removeChild(style)

			csses = csses + scoper(css, suffix)
		}
	}

	if (newstyle.styleSheet) {
		newstyle.styleSheet.cssText = csses
	} else {
		newstyle.appendChild(document.createTextNode(csses))
	}
	head.appendChild(newstyle)

	document.getElementsByTagName('body')[0].style.visibility = 'visible'
}

init()

export default process
