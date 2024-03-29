module.exports = {
	presets: [
		[
			'@babel/env',
			{
				targets: {
					node: 8
				},
				forceAllTransforms: true
			}
		],
		'@babel/typescript'
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-runtime'
	],
	overrides: [
		{
			include: ['test/cli-packages'],
			presets: ['@vue/app']
		}
	]
}
