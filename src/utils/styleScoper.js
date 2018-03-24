/* eslint-disable no-control-regex */

// used to make CSS selectors remain scoped properly
let processOffset = 0;

function init() {
	const style = document.createElement('style');
	style.appendChild(document.createTextNode(''));
	document.head.appendChild(style);
	style.sheet.insertRule('body { visibility: hidden; }', 0);
}

function scoper(css, prefix) {
	const re = new RegExp('([^\r\n,{}]+)(,(?=[^}]*{)|s*{)', 'g');
	css = css.replace(re, function(g0, g1, g2) {
		if (g1.match(/^\s*(@media|@keyframes|to|from|@font-face)/)) {
			return g1 + g2;
		}

		if (g1.match(/:scope/)) {
			g1 = g1.replace(/([^\s]*):scope/, function(h0, h1) {
				if (h1 === '') {
					return '> *';
				}
				return '> ' + h1;
			});
		}

		g1 = g1.replace(/^(\s*)/, '$1' + prefix + ' ');

		return g1 + g2;
	});

	return css;
}

function process() {
	const styles = document.body.querySelectorAll('style[scoped]');

	if (styles.length === 0) {
		document.getElementsByTagName('body')[0].style.visibility = 'visible';
		return;
	}

	const head = document.head || document.getElementsByTagName('head')[0];
	const newstyle = document.createElement('style');
	newstyle.dataset.cssscoper = 'true';
	let csses = '';

	let idx;
	for (idx = 0; idx < styles.length; idx++) {
		const style = styles[idx];
		const css = style.innerHTML;

		if (css && style.parentElement.nodeName !== 'BODY') {
			const id = 'scoper-' + (idx + processOffset);
			const prefix = '#' + id;

			const wrapper = document.createElement('span');
			wrapper.id = id;

			const parent = style.parentNode;
			const grandparent = parent.parentNode;

			grandparent.replaceChild(wrapper, parent);
			wrapper.appendChild(parent);
			style.parentNode.removeChild(style);

			csses = csses + scoper(css, prefix);
		}
	}

	processOffset += idx + 1;

	if (newstyle.styleSheet) {
		newstyle.styleSheet.cssText = csses;
	} else {
		newstyle.appendChild(document.createTextNode(csses));
	}

	head.appendChild(newstyle);
	document.getElementsByTagName('body')[0].style.visibility = 'visible';
}

init();

export default process;
