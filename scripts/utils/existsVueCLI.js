/**
 * Return if exists Vue CLI
 *
 * @return {boolean}
 */
module.exports = function existsVueCLI() {
	try {
		require('@vue/cli-service/package.json');
		return true
	} catch (err) {
		return false;
	}
};
