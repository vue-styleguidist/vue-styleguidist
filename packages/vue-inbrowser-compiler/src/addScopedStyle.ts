import scoper from './styleScoper'

/**
 * Add a style block to the head to load the styles.
 * uses the suffix to scope the styles
 */
export default function addScopedStyle(css: string, suffix: string) {
	const head = document.head || document.getElementsByTagName('head')[0]
	const newstyle = document.createElement('style')
	newstyle.dataset.cssscoper = 'true'
	const csses = scoper(css, `[data-${suffix}]`)
	const styleany = newstyle as any
	if (styleany.styleSheet) {
		styleany.styleSheet.cssText = csses
	} else {
		newstyle.appendChild(document.createTextNode(csses))
	}
	head.appendChild(newstyle)
}
