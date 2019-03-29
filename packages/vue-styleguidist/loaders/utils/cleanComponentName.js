module.exports = function clean(displayName) {
	return displayName.replace(/[^A-Za-z0-9]/g, '')
}
