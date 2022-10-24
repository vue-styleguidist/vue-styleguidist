import { expect } from 'vitest'
import { mergeTranslationsAsObject } from './mergeTranslations'

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
  tags: {},
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
			{
			  "description": "un example de traduction d'un composant",
			  "displayName": "origin",
			  "exportName": "default",
			  "props": [
			    {
			      "description": "nombre de colomnes",
			      "name": "span",
			    },
			    {
			      "description": "Sm breakpoint and above",
			      "name": "spanSm",
			    },
			    {
			      "description": "taille du bouton",
			      "name": "size",
			    },
			  ],
			  "tags": {},
			}
		`)
	})
})
