import { mergeTranslationsAsObject } from '../mergeTranslations'

const trad = [
	{
		name: 'default',
		description: "un example de traduction d'un composant",
		props: [
			{
				name: 'size',
				description: 'taille du bouton'
			},
			{
				name: 'span',
				description: 'nombre de colomnes'
			}
		]
	}
]

const orig = {
	exportName: 'default',
	displayName: 'origin',
	description:
		'This is an example of creating a reusable button component and using it with external data.',
	props: [
		{
			name: 'span',
			description: 'Number of columns (1-12) the column should span.'
		},
		{
			name: 'spanSm',
			description: 'Sm breakpoint and above'
		},
		{
			name: 'size',
			description: 'The size of the button'
		}
	]
}

describe('mergeTranslationsAsObject', () => {
	it('should match the object', () => {
		expect(mergeTranslationsAsObject(orig, trad)).toMatchInlineSnapshot(`
		Object {
		  "description": "un example de traduction d'un composant",
		  "displayName": "origin",
		  "exportName": "default",
		  "props": Array [
		    Object {
		      "description": "nombre de colomnes",
		      "name": "span",
		    },
		    Object {
		      "description": "Sm breakpoint and above",
		      "name": "spanSm",
		    },
		    Object {
		      "description": "taille du bouton",
		      "name": "size",
		    },
		  ],
		}
	`)
	})
})
