// use the babel config of the monorepo
const babelCore = require('../../babel.config')

module.exports = {
	...babelCore,
	overrides: [
		...babelCore.overrides,
		{
			include: ['src/client'],
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
			]
		}
	]
}
