// eslint-disable-next-line no-unused-vars
import { ComponentDoc } from 'vue-docgen-api'
import findOrigins from '../findOrigins'

describe('findOrigins', () => {
	it('findOrigins() should return all filePaths in extends and mixins', () => {
		const result = findOrigins({
			props: [
				{ name: 'a', extends: { path: 'path/to/extends/prop' } },
				{ name: 'b', extends: { path: 'path/to/extends' } },
				{ name: 'c', mixin: { path: 'path/to/mixin' } }
			],
			methods: [
				{ name: 'm1', extends: { path: 'path/to/extends/method' } },
				{ name: 'm2', extends: { path: 'path/to/extends' } },
				{ name: 'm3', mixin: { path: 'path/to/mixin' } }
			]
		} as ComponentDoc)

		expect(result).toMatchInlineSnapshot(`
		Array [
		  "path/to/extends/prop",
		  "path/to/extends",
		  "path/to/mixin",
		  "path/to/extends/method",
		]
	`)
	})
})
