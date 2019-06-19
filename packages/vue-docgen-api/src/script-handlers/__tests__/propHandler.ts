import { ParserPlugin } from '@babel/parser'
import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import { Documentation, PropDescriptor } from '../../Documentation'
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
			tags: {}
		}
		const MockDocumentation = require('../../Documentation').Documentation
		documentation = new MockDocumentation()
		const mockGetPropDescriptor = documentation.getPropDescriptor as jest.Mock
		mockGetPropDescriptor.mockReturnValue(mockPropDescriptor)
	})

	function tester(src: string, matchedObj: any, plugins?: ParserPlugin[]) {
		const def = parse(src, plugins)
		if (def) {
			propHandler(documentation, def)
		}
		expect(mockPropDescriptor).toMatchObject(matchedObj)
	}

	describe('base', () => {
		it('should accept an array of string as props and set required as "" for backwards comp', () => {
			const src = `
        export default {
          props: ['testArray']
        }`
			const def = parse(src)
			if (def) {
				propHandler(documentation, def)
			}
			expect(mockPropDescriptor.required).toEqual('')
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
	})

	describe('typescript Vue.extends', () => {
		it('should be ok with Prop', () => {
			const src = `
			  export default Vue.extend({
				props: {
				  tsvalue: {
					type: [String, Number] as Prop<SelectOption['value']>
				  }
				}
			  });`
			tester(
				src,
				{
					type: {
						name: '[String, Number] as Prop<SelectOption["value"]>'
					}
				},
				['typescript']
			)
			expect(documentation.getPropDescriptor).toHaveBeenCalledWith('tsvalue')
		})

		it('should understand "As" anotations', () => {
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
					}
				},
				['typescript']
			)
		})
	})
})
