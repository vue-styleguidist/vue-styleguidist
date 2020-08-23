/* eslint-disable no-control-regex */

// used to make CSS selectors remain scoped properly
export default function scoper(css: string, suffix: string) {
	const re = /([^\r\n,{}]+)(,(?=[^}]*{)|s*{)/g

	// `after` is going to contain eithe a comma or an opening curly bracket
	css = css.replace(re, function (full, selector, after) {
		// if non-rule delimiter
		if (selector.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
			return selector + after
		}

		// don't scope the part of the selector after ::v-deep
		const arrayDeep = /(.*)(::v-deep|>>>|\/deep\/)(.*)/g.exec(selector)
		if (arrayDeep) {
			const [, beforeVDeep, , afterVDeep] = arrayDeep
			selector = beforeVDeep
			after = afterVDeep + after
		}

		// deal with :scope pseudo selectors
		if (selector && selector.match(/:scope/)) {
			selector = selector.replace(/([^\s]*):scope/, function (ful: string, cutSelector: string) {
				if (cutSelector === '') {
					return '> *'
				}
				return '> ' + cutSelector
			})
		}

		// deal with other pseudo selectors
		let pseudo = ''
		if (selector && selector.match(/:/)) {
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
