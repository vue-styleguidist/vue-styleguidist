import isNaN from 'lodash/isNaN';

/**
 * Returns an object containing component/section name and, optionally, an example index
 * from hash part or page URL:
 * #!/Button → { targetName: 'Button' }
 * #!/Button/1 → { targetName: 'Button', targetIndex: 1 }
 *
 * @param {string} hash
 * @returns {object}
 */
export default function getInfoFromHash(hash) {
	if (hash.substr(0, 3) === '#!/') {
		let path = hash.substr(3);
		if (path.indexOf('?id') > -1) {
			path = path.replace(path.slice(path.indexOf('?id')), '');
		}
		const tokens = path.split('/');
		const index = parseInt(tokens[1], 10);
		return {
			targetName: decodeURIComponent(tokens[0]),
			targetIndex: isNaN(index) ? undefined : index,
		};
	}
	return {};
}
