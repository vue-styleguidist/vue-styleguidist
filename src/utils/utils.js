import getUrl from './getUrl';

/**
 * Remove quotes around given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function unquote(string) {
	return string.replace(/^['"]|['"]$/g, '');
}

/**
 * Return prop type object.
 *
 * @param {object} prop
 * @returns {object}
 */
export function getType(prop) {
	return prop.flowType || prop.type;
}

/**
 * Show starting and ending whitespace around given string.
 *
 * @param {string} string
 * @returns {string}
 */
export function showSpaces(string) {
	return string.replace(/^\s|\s$/g, '␣');
}

export function getUrlNavigation(
	navigation,
	{ level, sections, components, nameParent, name, slug }
) {
	if (navigation) {
		if (level < 2 && (sections || components)) {
			return getUrl({ name, isolated: true });
		}
		return getUrl({ name: nameParent, id: slug, isolated: true });
	}
	return `#${slug}`;
}
