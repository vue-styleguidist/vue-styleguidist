module.exports = function describeTasks(api) {
	api.describeTask({
		match: /vue-cli-service docgen:watch$/,
		description: 'Compile the docs for all your components and keep watching changes'
	})

	api.describeTask({
		match: /vue-cli-service docgen$/,
		description: 'Compile component markdown docs'
	})
}
