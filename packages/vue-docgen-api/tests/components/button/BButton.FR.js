module.exports = [
	{
		name: 'default',
		/* @orig: This is an example of creating a reusable button component and using it with external data.*/
		description:
			'This is an example of creating a reusable button component and using it with external data.',
		props: [
			{
				name: 'span',
				/* @orig: Number of columns (1-12) the column should span.*/
				description: 'Number of columns (1-12) the column should span.'
			},
			{
				name: 'spanSm',
				/* @orig: Sm breakpoint and above*/
				description: 'Sm breakpoint and above'
			},
			{
				name: 'size',
				/* @orig: The size of the button*/
				description: 'taille du bouton'
			},
			{
				name: 'spanMd',
				/* @orig: Md breakpoint and above*/
				description: 'Md breakpoint and above'
			},
			{
				name: 'example',
				/* @orig: The example props*/
				description: 'The example props'
			},
			{
				name: 'v-model',
				/* @orig: Model example2*/
				description: 'Model example2'
			},
			{
				name: 'example3',
				/* @orig: The example3 props*/
				description: 'The example3 props'
			},
			{
				name: 'onCustomClick',
				/* @orig: Add custom click actions.*/
				description: 'Add custom click actions.'
			},
			{
				name: 'funcDefault',
				/* @orig: Function default*/
				description: 'Function default'
			},
			{
				name: 'propE',
				/* @orig: Object or array defaults must be returned from
a factory function*/
				description: 'Object or array defaults must be returned from\na factory function'
			}
		],
		events: [
			{
				name: 'success',
				/* @orig: Success event.*/
				description: 'Success event.',
				properties: [
					{
						name: 'demo',
						/* @orig: example*/
						description: 'example'
					},
					{
						name: 'called',
						/* @orig: test called*/
						description: 'test called'
					},
					{
						name: 'isPacked',
						/* @orig: Indicates whether the snowball is tightly packed.*/
						description: 'Indicates whether the snowball is tightly packed.'
					}
				]
			}
		],
		slots: [
			{
				name: 'default',
				/* @orig: Use this slot default*/
				description: 'Use this slot default'
			}
		]
	}
]
