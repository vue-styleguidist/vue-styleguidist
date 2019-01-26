module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				targets: {
					chrome: 59,
					ie: 11,
				},
				forceAllTransforms: true,
				modules: false,
			},
		],
		'@babel/preset-react',
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
	],
	env: {
		test: {
			presets: ['@babel/preset-env', '@babel/preset-react'],
			plugins: [
				'@babel/plugin-syntax-dynamic-import',
				'@babel/plugin-proposal-class-properties',
				'@babel/plugin-proposal-object-rest-spread',
			],
		},
	},
};
