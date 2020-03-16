import { generateTranslation } from '../generateTrans'

describe('generateTrans', () => {
	it('translate all description', () => {
		const obj = generateTranslation({
			displayName: 'bar',
			exportName: 'default',
			props: [
				{ name: 'foo', description: 'EN-1', tags: { author: [{ title: 'author', name: 'bart' }] } },
				{ name: 'bar', description: 'EN-2', tags: { author: [{ title: 'author', name: 'bart' }] } }
			]
		})
		expect(obj).toMatchInlineSnapshot(`
		"module.exports = {
		    'props': [
		        {
		            /* @orig: EN-1*/
		            'description': 'EN-1'
		        },
		        {
		            /* @orig: EN-2*/
		            'description': 'EN-2'
		        }
		    ]
		}"
	`)
	})
})
