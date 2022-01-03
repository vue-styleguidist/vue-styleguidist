import { resolve } from 'path'
import ComponentStore, { ComponentStoreOptions } from '.'

jest.mock('fast-glob', () => {
	return () => Promise.resolve(['foo.vue', 'bar.vue'])
})

jest.mock('vue-docgen-api', () => {
	return {
		parseMulti: () =>
			Promise.resolve([
				{
					displayName: 'Foo',
					exportName: 'default'
				}
			])
	}
})

describe('component-store', () => {
	function makeComponentStore(options: Partial<ComponentStoreOptions> = {}): ComponentStore {
		const {
			projectRoot = resolve(__dirname, '../../../fixtures/project'),
			componentRoot = 'src/components',
			components = ['**/*.vue'],
			sections = []
		} = options

		return new ComponentStore({
			projectRoot,
			componentRoot,
			components,
			sections
		})
	}

	describe('getMenuTree', () => {
		it('should return a flat list of components', async () => {
			const store = makeComponentStore({ componentRoot: 'src' })
			const tree = await store.getMenuTree()
			expect(tree).toHaveProperty('length', 2)
		})

		it('should return a tree of components', async () => {
			const store = makeComponentStore({
				sections: [
					{
						name: 'Section 1',
						components: ['**/*.vue'],
						sections: [
							{
								name: 'Section 2',
								components: ['**/*.vue']
							},
							{
								name: 'Section 3',
								components: ['**/*.vue']
							}
						]
					},
					{
						name: 'Section 4',
						components: ['**/*.vue']
					}
				],
				components: []
			})
			const tree = await store.getMenuTree()
			expect(tree).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "components": Array [
			      Object {
			        "displayName": "Foo",
			        "routeName": "foo.vue#default",
			      },
			      Object {
			        "displayName": "Foo",
			        "routeName": "bar.vue#default",
			      },
			      Object {
			        "components": Array [
			          Object {
			            "displayName": "Foo",
			            "routeName": "foo.vue#default",
			          },
			          Object {
			            "displayName": "Foo",
			            "routeName": "bar.vue#default",
			          },
			        ],
			        "displayName": "Section 2",
			      },
			      Object {
			        "components": Array [
			          Object {
			            "displayName": "Foo",
			            "routeName": "foo.vue#default",
			          },
			          Object {
			            "displayName": "Foo",
			            "routeName": "bar.vue#default",
			          },
			        ],
			        "displayName": "Section 3",
			      },
			    ],
			    "displayName": "Section 1",
			  },
			  Object {
			    "components": Array [
			      Object {
			        "displayName": "Foo",
			        "routeName": "foo.vue#default",
			      },
			      Object {
			        "displayName": "Foo",
			        "routeName": "bar.vue#default",
			      },
			    ],
			    "displayName": "Section 4",
			  },
			]
		`)
		})
	})
})
