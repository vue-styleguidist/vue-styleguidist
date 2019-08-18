module.exports = {
	presets: [
		[
			'@babel/env',
			{
				targets: {
					chrome: 59,
					ie: 11
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
	],
	env: {
		test: {
			presets: ['@babel/env', '@babel/react'],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-object-rest-spread',
				'@babel/plugin-transform-runtime'
			]
		}
	},
	overrides: [
		{
			test: './test/cli-packages',
			presets: ['@vue/app']
		},
		{
			test: /packages[\\/]vue-styleguidist[\\/]src[\\/]client[\\/]/,
			presets: [
				[
					'@babel/env',
					{
						targets: {
							chrome: 59,
							ie: 11
						},
						forceAllTransforms: true,
						modules: false
					}
				],
				'@babel/react'
			]
		}
	]
}
