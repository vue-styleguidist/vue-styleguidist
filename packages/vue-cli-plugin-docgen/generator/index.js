module.exports = api => {
	// register styleguide command
	api.extendPackage({
		scripts: {
			docgen: 'vue-cli-service docgen',
			'docgen:watch': 'vue-cli-service docgen:watch'
		}
	})

	// add all the files from template
	api.render('./template')
}
