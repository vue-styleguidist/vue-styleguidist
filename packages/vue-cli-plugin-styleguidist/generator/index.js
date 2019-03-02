module.exports = api => {
	// register styleguide command
	api.extendPackage({
		scripts: {
			styleguide: 'vue-cli-service styleguidist',
			'styleguide:build': 'vue-cli-service styleguidist:build'
		}
	})

	// add all the files from template
	api.render('./template')
}
