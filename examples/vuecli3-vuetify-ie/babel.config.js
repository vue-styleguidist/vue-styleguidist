module.exports = {
	sourceType: 'unambiguous',
	presets: [
		[
			'@babel/env',
			{
				useBuiltIns: 'usage',
				corejs: 3,
				targets: {
					ie: '11'
				}
			}
		]
	]
}
