// use the babel config of the monorepo
const babelCore = require('../../babel.config')

module.exports = {
	...babelCore,
	overrides: [
		...babelCore.overrides,
		{
			include: ['src/bin', 'src/loaders', 'src/scripts'],
			exclude: ['src/loaders/utils/client'],
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
		}
	]
}
