module.exports = {
	sourceType: 'unambiguous',
	presets: [
		[
			'@babel/env',
			{
				useBuiltIns: 'usage',
				corejs: 2,
				targets: {
					ie: '11'
				}
			}
		]
	]
}
