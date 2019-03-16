module.exports = api => {
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

	api.describeConfig({
		// Using reverse domain name notation, as per Vue UI docs.
		// Would be nice to remove the 'github' from it.
		id: 'io.github.vue-styleguidist',
		name: 'Vue Styleguidist configuration',
		description: 'Create your style guide',
		link: 'https://vue-styleguidist.github.io',

		// Logo is pulled from the root of this directory.
		// See: https://cli.vuejs.org/dev-guide/ui-info.html#logo

		onRead: ({ data, cwd }) => ({
			prompts: [
				// Prompt objects
			]
		}),
		onWrite: ({ prompts, answers, data, files, cwd, api }) => {
			// ...
		}
	})
}
