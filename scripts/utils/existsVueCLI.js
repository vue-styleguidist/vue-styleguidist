/**
 * Return if exists Vue CLI
 *
 * @return {boolean}
 */
module.exports = function existsVueCLI() {
	try {
		// eslint-disable-next-line import/no-unresolved
		require('@vue/cli-service/package.json');
		return true;
	} catch (err) {
		return false;
	}
};
