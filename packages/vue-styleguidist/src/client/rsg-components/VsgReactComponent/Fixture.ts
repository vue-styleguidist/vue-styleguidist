import React from 'react'

const _require = () => React

const evalInContext = (a: string) =>
	new Function('require', 'const React = require("react");' + a).bind(null, _require)

export default {
	name: 'Foo',
	visibleName: 'Foo',
	slug: 'foo',
	pathLine: 'foo/bar.js',
	props: {
		displayName: 'name of the component',
		description: 'Bar',
		methods: [
			{
				name: 'set',
				params: [
					{
						name: 'newValue',
						description: 'New value for the counter.'
					}
				],
				returns: undefined,
				description: 'Sets the counter to a particular value.'
			}
		],
		props: [
			{
				name: 'foo',
				description: 'A nice prop'
			},
			{
				name: 'bar'
			}
		],
		slots: {
			default: {
				name: 'default',
				description: 'another nice slot'
			}
		},
		expose: [
			{
				name: 'exposedBar',
				description: 'exposed bar'
			}
		],
		examples: [
			{
				type: 'code',
				content: '<button>Code: OK</button>',
				evalInContext
			},
			{
				type: 'markdown',
				content: 'Markdown: Hello *world*!'
			}
		]
	},
	metadata: {
		tags: ['one', 'two']
	}
}
