module.exports = {
	presets: [
		[
			'@babel/env',
			{
				useBuiltIns: 'usage',
				corejs: 3,
				targets: {
					chrome: 59,
					ie: 11
				},
				forceAllTransforms: true,
				modules: false
			}
		],
		'@babel/typescript',
		'@babel/react'
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
		'@babel/plugin-transform-runtime'
	],
	overrides: [
		{
			include: ['packages/vue-docgen-api/src', 'packages/vue-docgen-cli/src'],
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
			]
		},
		{
			include: ['test/cli-packages'],
			presets: ['@vue/app']
		}
	],
	env: {
		test: {
			presets: [
				[
					'@babel/env',
					{
						loose: true,
						modules: 'commonjs',
						useBuiltIns: 'usage',
						corejs: 3,
						targets: {
							node: 'current'
						}
					}
				],
				'@babel/react'
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-object-rest-spread',
				'@babel/plugin-transform-runtime'
			]
		}
	}
}
