import { ParserPlugin } from '@babel/parser'
import { NodePath } from 'ast-types'
import babylon from '../../babel-parser'
import Documentation, { PropDescriptor } from '../../Documentation'
import resolveExportedComponent from '../../utils/resolveExportedComponent'
import propHandler from '../propHandler'

jest.mock('../../Documentation')

function removeWhitespaceForTest(defaultValue: PropDescriptor['defaultValue'] = { value: '' }) {
	return {
		func: defaultValue.func,
		value: defaultValue.value.replace(/\s|\n|\t/g, '')
	}
}

function parse(src: string, plugins?: ParserPlugin[]): NodePath | undefined {
	const ast = babylon({ plugins }).parse(src)
	return resolveExportedComponent(ast)[0].get('default')
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
		documentation = new MockDocumentation('test/path')
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
			const src = ['export default {', '  props:{', "    test: PropTypes.oneOf(['News', 'Photos'])", '  }', '}'].join(
				'\n'
			)
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

		it('should be ok with the default as a method', () => {
			const src = [
				'export default {',
				'  props: {',
				'    test: {',
				'      default() {',
				'        return ["normal"]',
				'      }',
				'    }',
				'  }',
				'}'
			].join('\n')

			expect(parserTest(src).defaultValue).toMatchInlineSnapshot(`
      Object {
        "func": true,
        "value": "function() {
          return [\\"normal\\"];
      }",
      }
    `)
		})

		it('should deal properly with multilple returns', () => {
			const src = `
        export default {
          props: {
            test: {
              type: Array,
              default: function () {
                if (logger.mounted) {
                  return []
                } else {
                  return undefined
                }
              }
            }
          }
        }
        `
			const testParsed = parserTest(src)
			const defaultValue = removeWhitespaceForTest(testParsed.defaultValue)
			expect(defaultValue).toMatchObject({
				func: true,
				value: `function(){if(logger.mounted){return[];}else{returnundefined;}}`
			})
		})

		it('should deal properly with multilple returns in arrow functions', () => {
			const src = `
        export default {
          props: {
            test: {
              type: Array,
              default: () => {
                if (logger.mounted) {
                  return []
                } else {
                  return undefined
                }
              }
            }
          }
        }
        `
			const testParsed = parserTest(src)
			const defaultValue = removeWhitespaceForTest(testParsed.defaultValue)
			expect(defaultValue).toMatchObject({
				func: true,
				value: `()=>{if(logger.mounted){return[];}else{returnundefined;}}`
			})
		})

		// type, format of default input, result of parsing
		test.each([
			['Object', 'default: () => ({ a: 1 })', '{a:1}', ''],
			['Object', 'default: () => { return { a: 1 } }', '{a:1}', ''],
			['Object', 'default () { return { a: 1 } }', '{a:1}', ''],
			['Object', 'default: function () { return { a: 1 } }', '{a:1}', ''],
			['Object', 'default: () => ({ a: 1 })', '{a:1}', '{{a: number}}'],
			['Object', 'default: null', 'null', ''],
			['Object', 'default: undefined', 'undefined', ''],
			['Array', 'default: () => ([{a: 1}])', '[{a:1}]', ''],
			['Array', 'default: () => [{a: 1}]', '[{a:1}]', ''],
			['Array', 'default: () => { return [{a: 1}] }', '[{a:1}]', ''],
			['Array', 'default () { return [{a: 1}] }', '[{a:1}]', ''],
			['Array', 'default: function () { return [{a: 1}] }', '[{a:1}]', ''],
			['Array', 'default: null', 'null', ''],
			['Array', 'default: undefined', 'undefined', ''],
			['Function', 'default: (a, b) => ({ a, b })', '(a,b)=>({a,b})', ''],
			['Function', 'default (a, b) { return { a, b } }', 'function(a,b){return{a,b};}', ''],
			['Function', 'default: (a, b) => { return { a, b } }', '(a,b)=>{return{a,b};}', ''],
			['Function', 'default: function (a, b) { return { a, b } }', 'function(a,b){return{a,b};}', '']
		])(
			'if prop is of type %p,\n\t given %p as default,\n\t should parse as %p,\n\t comment types are %p',
			(propType, input, output, commentsBlockType) => {
				const src = `
                export default {
                  props: {
                    /**
                     * ${commentsBlockType.length ? `@type ${commentsBlockType}` : ''}
                     */
                    test: {
                      type: ${propType},
                      ${input}
                    }
                  }
                }
                `
				const testParsed = parserTest(src)
				const defaultValue = removeWhitespaceForTest(testParsed.defaultValue)
				expect(defaultValue).toMatchObject({ value: output })
			}
		)
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
         * @values red, blue
         * @author me
         */
        color: {
            type: String
        }
    }
  }
  `
			tester(src, {
				description: 'color of the component',
				values: ['dark', 'light', 'red', 'blue'],
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

		it('should check the validator method for super standard values', () => {
			const src = `
  export default {
    props: {
        color: {
			type: String,
			validator(va){
				return ['dark', 'light', 'red', 'blue'].indexOf(va) > -1
			} 
        }
    }
  }
  `
			expect(parserTest(src).values).toMatchObject(['dark', 'light', 'red', 'blue'])
		})

		it('should check the validator arrow function for super standard values', () => {
			const src = `
  export default {
    props: {
        color: {
			type: String,
			validator: (va) => 
				['dark', 'light', 'red', 'blue'].indexOf(va) > -1
        }
    }
  }
  `
			expect(parserTest(src).values).toMatchObject(['dark', 'light', 'red', 'blue'])
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

		it('should parse values in TypeScript typings', () => {
			const src = `
        export default Vue.extend({
        props: {
          tsvalue: {
          type: String as Prop<('foo' | 'bar')>,
          required: true
          }
        }
        });`
			tester(
				src,
				{
					values: ['foo', 'bar'],
					type: {
						name: 'string'
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

	describe('@type', () => {
		it('should use @type typings', () => {
			const src = `
      export default {
        props: {
        /**
         * @type {{ bar: number, foo: string }}
         */
        blockData: {
          type: Object,
          default: () => {},
        },
        }
      };`
			tester(src, {
				type: {
					name: '{ bar: number, foo: string }'
				}
			})
		})

		it('should extract values from @type typings', () => {
			const src = `
      export default {
        props: {
        /**
         * @type { "bar + boo" | "foo & baz" }}
         */
        blockData: {
          type: String,
          default: () => {},
        },
        }
      };`
			tester(src, {
				values: ['bar + boo', 'foo & baz'],
				type: {
					name: 'string'
				}
			})
		})
	})
})
