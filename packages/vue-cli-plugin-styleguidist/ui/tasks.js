module.exports = function describeTasks(api) {
	api.describeTask({
		match: /vue-cli-service styleguidist$/,
		description: 'Compiles and hot-reloads styleguide for development',
		link: 'https://vue-styleguidist.github.io/CLI.html#cli-commands-and-options'
	})

	api.describeTask({
		match: /vue-cli-service styleguidist:build$/,
		description: 'Compiles styleguide assets for production',
		link: 'https://vue-styleguidist.github.io/CLI.html#cli-commands-and-options'
	})
}
