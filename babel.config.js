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
				}
			}
		],
		'@babel/typescript',
		'@babel/react'
	],
	plugins: ['@babel/plugin-proposal-class-properties'],
	overrides: [
		{
			include: [
				'packages/vue-styleguidist/src/bin',
				'packages/vue-styleguidist/src/loaders',
				'packages/vue-styleguidist/src/scripts',
				'packages/vue-docgen-api/src',
				'packages/vue-docgen-cli/src'
			],
			exclude: ['packages/vue-styleguidist/src/loaders/utils/client'],
			presets: [
				[
					'@babel/env',
					{
						modules: 'cjs',
						targets: {
							node: 10
						},
						forceAllTransforms: true
					}
				],
				'@babel/typescript'
			],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-object-rest-spread'
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
