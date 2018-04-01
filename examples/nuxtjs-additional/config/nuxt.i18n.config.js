const en = require('../src/assets/i18n/en.json');
const pl = require('../src/assets/i18n/pl.json');

exports.default = [
	'nuxt-i18n',
	{
		locales: [{ code: 'en' }, { code: 'pl' }],
		defaultLocale: 'en',
		vueI18n: {
			fallbackLocale: 'en',
			messages: {
				en,
				pl,
			},
		},
	},
];
