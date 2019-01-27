module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: false,
			},
		],
	],
	plugins: [
		'@babel/plugin-syntax-dynamic-import',
		'@babel/plugin-proposal-class-properties',
		'@babel/plugin-proposal-object-rest-spread',
	],
};
