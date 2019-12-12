import { ParserPlugin } from '@babel/parser'
import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import Documentation, { PropDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import propHandler from '../propHandler'

jest.mock('../../Documentation')

function parse(src: string, plugins?: ParserPlugin[]): NodePath | undefined {
	const ast = babylon({ plugins }).parse(src)
	return resolveExportedComponent(ast).get('default')
}

describe('propHandler', () => {
	let documentation: Documentation
	let mockPropDescriptor: PropDescriptor

	beforeEach(() => {
		mockPropDescriptor = {
			description: '',
			tags: {},
			name: ''
		}
		const MockDocumentation = require('../../Documentation').default
		documentation = new MockDocumentation()
		const mockGetPropDescriptor = documentation.getPropDescriptor as jest.Mock
		mockGetPropDescriptor.mockReturnValue(mockPropDescriptor)
	})

	function parserTest(src: string, plugins?: ParserPlugin[]): PropDescriptor {
		const def = parse(src, plugins)
		if (def) {
			propHandler(documentation, def)
		}
		return mockPropDescriptor
	}

	function tester(src: string, matchedObj: any, plugins?: ParserPlugin[]) {
		expect(parserTest(src, plugins)).toMatchObject(matchedObj)
	}

	describe('base', () => {
		it('should accept an array of string as props', () => {
			const src = `
        export default {
          props: ['testArray']
        }`
			const def = parse(src)
			if (def) {
				propHandler(documentation, def)
			}
			expect(mockPropDescriptor.required).toBeFalsy()
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('testArray')
		})
	})

	describe('type', () => {
		it('should return the right props type', () => {
			const src = `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              type: Array
            }
          }
        }
        `
			tester(src, {
				type: { name: 'array' }
			})
		})

		it('should return the right props type for lit Array', () => {
			const src = `
        export default {
          props: {
            columns: [Array]
          }
        }
        `
			tester(src, {
				type: { name: 'array' }
			})
		})

		it('should return the right props composite type', () => {
			const src = `
        export default {
          props: {
            test: {
              type: [String, Number]
            }
          }
        }
        `
			tester(src, {
				type: { name: 'string|number' }
			})
		})

		it('should return the right props type for Array', () => {
			const src = `
        export default {
          props: {
            test: Array
          }
        }
        `
			tester(src, {
				type: { name: 'array' }
			})
		})

		it('should not return required if prop only Type', () => {
			const src = `
        export default {
          props: {
            test: String
          }
        }
        `
			const def = parse(src)
			if (def) {
				propHandler(documentation, def)
			}
			expect(mockPropDescriptor.required).toBeUndefined()
		})

		it('should return the right props type string', () => {
			const src = `
        export default {
          props: {
            test: String
          }
        }
        `
			tester(src, {
				type: { name: 'string' }
			})
		})

		it('should return the right props composite string|number', () => {
			const src = `
        export default {
          props: {
            test: [String, Number]
          }
        }
        `
			tester(src, {
				type: { name: 'string|number' }
			})
		})

		it('should deduce the prop type from the default value', () => {
			const src = `
        export default {
          props: {
            test:{
              default: false
            }
          }
        }
        `
			tester(src, {
				type: { name: 'boolean' }
			})
		})

		it('should still return props with vue-types', () => {
			const src = [
				'export default {',
				'  props:{',
				'    test: VueTypes.shape({',
				'       line1: String,',
				'       line2: String,',
				'    })',
				'  }',
				'}'
			].join('\n')
			tester(src, {
				type: {
					func: true
				}
			})
		})

		it('should still return props with prop-types', () => {
			const src = [
				'export default {',
				'  props:{',
				"    test: PropTypes.oneOf(['News', 'Photos'])",
				'  }',
				'}'
			].join('\n')
			tester(src, {
				type: {
					func: true
				}
			})
		})

		it('should still return props with delegated types', () => {
			const src = ['export default {', '  props: {', '    toto', '  }', '}'].join('\n')
			tester(src, {
				type: {}
			})
		})
	})

	describe('required', () => {
		it('should return the right required props', () => {
			const src = `
        export default {
          name: 'name-123',
          components: {
            testComp: {}
          },
          props: {
            test: {
              required: true
            }
          }
        }
        `
			tester(src, {
				required: true
			})
		})
	})

	describe('defaultValue', () => {
		it('should return the right default', () => {
			const src = `
        export default {
          props: {
            test: {
              default: ['hello']
            }
          }
        }
        `
			tester(src, {
				defaultValue: { value: `["hello"]` }
			})
		})

		it('should be ok with just the default', () => {
			const src = `
        export default {
          props: {
            test: {
              default: 'normal'
            }
          }
        }
        `
			tester(src, {
				defaultValue: { value: `"normal"` }
			})
		})

		it('should return the body of the function as default value without parenthesis', () => {
			const src = `
        export default {
          props: {
            test: {
              default: () => ({})
            }
          }
        }
        `
			tester(src, {
				defaultValue: { value: `{}` }
			})
		})

		it('should be ok with the default between quotes', () => {
			const src = `
        export default {
          'props': {
            'test': {
              'default': 'normal'
            }
          }
        }
        `
			tester(src, {
				defaultValue: { value: `"normal"` }
			})
		})

		it('should be ok with the default as a method', () => {
			const src = [
				'export default {',
				'	props: {',
				'		test: {',
				'			default() {',
				'				return ["normal"]',
				'			}',
				'		}',
				'	}',
				'}'
			].join('\n')

			expect(parserTest(src).defaultValue).toMatchInlineSnapshot(`
			Object {
			  "func": false,
			  "value": "function(){
			    return [\\"normal\\"];
			}",
			}
		`)
		})
	})

	describe('description', () => {
		it('should return the right description', () => {
			const src = `
        export default {
          props: {
            /**
             * test description
             */
            test: {
              required: true
            }
          }
        }
        `
			tester(src, {
				description: 'test description'
			})
		})
	})

	describe('v-model', () => {
		it('should set the @model property as v-model instead of test', () => {
			const src = `
        export default {
          props: {
            /**
             * test description
             * @model
             */
            test: String
          }
        }
        `
			tester(src, {
				description: 'test description'
			})
			expect(documentation.getPropDescriptor).not.toHaveBeenCalledWith('test')
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model')
		})

		it('should set the @model property as v-model instead of value even with a type', () => {
			const src = `
        export default {
          props: {
            /**
             * Binding from v-model
             * @model
             */
            value: {
				required: true,
				type: undefined
			}
          }
        }
        `
			tester(src, {
				description: 'Binding from v-model'
			})
			expect(documentation.getPropDescriptor).not.toHaveBeenCalledWith('value')
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model')
		})

		it('should set the v-model instead of value with model property', () => {
			const src = `
        export default {
		  model:{
			prop: 'value'
		  },
          props: {
            /**
             * Value of the field
             */
            value: {
				required: true,
				type: undefined
			}
          }
        }
        `
			tester(src, {
				description: 'Value of the field'
			})
			expect(documentation.getPropDescriptor).not.toHaveBeenCalledWith('value')
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('v-model')
		})

		it('should not set the v-model instead of value if model property has only event', () => {
			const src = `
        export default {
		  model:{
			event: 'change'
		  },
          props: {
            /**
             * Value of the field
             */
            value: {
				required: true,
				type: undefined
			}
          }
        }
        `
			tester(src, {
				description: 'Value of the field'
			})
			expect(documentation.getPropDescriptor).not.toHaveBeenCalledWith('v-model')
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('value')
		})
	})

	describe('@values tag parsing', () => {
		it('should parse the @values tag as its own', () => {
			const src = `
	export default {
	  props: {
		/**
		 * color of the component
		 * @values dark, light
		 * @author me
		 */
		color: {
			type: string
		}
	  }
	}
	`
			tester(src, {
				description: 'color of the component',
				values: ['dark', 'light'],
				tags: {
					author: [
						{
							description: 'me',
							title: 'author'
						}
					]
				}
			})
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('color')
		})
	})

	describe('typescript Vue.extends', () => {
		it('should be ok with Prop', () => {
			const src = `
			  export default Vue.extend({
				props: {
				  tsvalue: {
					type: [String, Number] as Prop<SelectOption['value']>,
					required: true
				  }
				}
			  });`
			tester(
				src,
				{
					type: {
						name: 'SelectOption["value"]'
					},
					required: true
				},
				['typescript']
			)
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('tsvalue')
		})

		it('should understand As anotations at the end of a prop definition', () => {
			const src = `
			export default Vue.extend({
			  props: {
				blockData: {
					type: Array,
					default: () => [],
				} as PropOptions<SocialNetwork[]>,
			  }
			});`
			tester(
				src,
				{
					type: {
						name: 'SocialNetwork[]'
					},
					defaultValue: {
						func: true,
						value: '() => []'
					}
				},
				['typescript']
			)
		})
	})
})
