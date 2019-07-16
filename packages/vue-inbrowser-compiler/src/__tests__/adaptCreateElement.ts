import { transform } from 'buble'
import { shallowMount, mount } from '@vue/test-utils'
import adaptCreateElement, { CreateElementFunction } from '../adaptCreateElement'

describe('adaptCreateElement', () => {
	let h: jest.Mock<CreateElementFunction>
	let pragma: CreateElementFunction
	beforeEach(() => {
		h = jest.fn()
		pragma = adaptCreateElement(h)
	})

	describe('group attributes', () => {
		it('should merge all non special attributes in attrs', () => {
			pragma('Component', { hello: 'hello' })
			expect(h).toHaveBeenCalledWith('Component', { attrs: { hello: 'hello' } })
		})

		it('should set all on attributes in an on object', () => {
			const handler = jest.fn()
			pragma('Component', { onClick: handler })
			expect(h).toHaveBeenCalledWith('Component', { on: { click: handler } })
		})

		it('should set all nativeOn attributes in a nativeOn object', () => {
			const handler = jest.fn()
			pragma('Component', { nativeOnClick: handler })
			expect(h).toHaveBeenCalledWith('Component', { nativeOn: { click: handler } })
		})

		it('should transform kebab-case into camel-case', () => {
			const handler = jest.fn()
			pragma('Component', { 'native-on-click': handler, 'hello-world': 'foo' })
			expect(h).toHaveBeenCalledWith('Component', {
				nativeOn: { click: handler },
				attrs: { helloWorld: 'foo' }
			})
		})
	})

	describe('from JSX', () => {
		const getComponent = (
			code: string,
			params: { [key: string]: any } = {}
		): { [key: string]: any } => {
			const compiledCode = transform('const a = ' + code, { jsx: '__pragma__(h)' }).code
			const [param1, param2, param3, param4] = Object.keys(params)
			const getValue = new Function(
				'__pragma__',
				param1,
				param2,
				param3,
				param4,
				compiledCode + ';return a;'
			)
			return getValue(
				adaptCreateElement,
				params[param1],
				params[param2],
				params[param3],
				params[param4]
			)
		}

		test('Contains text', () => {
			const wrapper = shallowMount(
				getComponent(`{
				render(h) {
				  return <div>test</div>
				},
			  }`)
			)

			expect(wrapper.is('div')).toBeTruthy()
			expect(wrapper.text()).toBe('test')
		})

		test('Binds text', () => {
			const text = 'foo'
			const wrapper = shallowMount(
				getComponent(
					`{
					render(h) {
						return <div>{text}</div>
					}
				}`,
					{ text }
				)
			)

			expect(wrapper.is('div')).toBeTruthy()
			expect(wrapper.text()).toBe('foo')
		})

		test('Extracts attrs', () => {
			const wrapper = shallowMount(
				getComponent(`{
					render(h) {
					  return <div id="hi" dir="ltr" />
					},
				  }`)
			)

			expect(wrapper.element.id).toBe('hi')
			expect(wrapper.element.dir).toBe('ltr')
		})

		test('Binds attrs', () => {
			const hi = 'foo'
			const wrapper = shallowMount(
				getComponent(
					`{
					render(h) {
					  return <div id={hi} />
					},
				  }`,
					{ hi }
				)
			)

			expect(wrapper.element.id).toBe('foo')
		})

		test('Omits attrs if possible', () => {
			const wrapper: any = shallowMount(
				getComponent(`{
					render(h) {
					  return <div>test</div>
					},
				  }`)
			)

			expect(wrapper.vnode.data).toBeUndefined()
		})

		test('Omits children if possible', () => {
			const wrapper: any = shallowMount(
				getComponent(`{
				render(h) {
				  return <div/>
				}
			  }`)
			)

			expect(wrapper.vnode.children).toBeUndefined()
		})

		test('Handles top-level special attrs', () => {
			const wrapper: any = shallowMount(
				getComponent(`{
					render(h) {
						return <div class="foo" style="bar" key="key" ref="ref" refInFor slot="slot" />
					}
				  }`)
			)
			expect(wrapper.vnode.data.class).toBe('foo')
			expect(wrapper.vnode.data.style).toBe('bar')
			expect(wrapper.vnode.data.key).toBe('key')
			expect(wrapper.vnode.data.ref).toBe('ref')
			expect(wrapper.vnode.data.refInFor).toBeTruthy()
			expect(wrapper.vnode.data.slot).toBe('slot')
		})

		test('Handles nested properties (camelCase)', () => {
			const noop = (_: any) => _
			const wrapper: any = shallowMount(
				getComponent(
					`{
			  render(h) {
				return (
				  <div propsOnSuccess={noop} onClick={noop} onCamelCase={noop} domPropsInnerHTML="<p>hi</p>" hookInsert={noop} />
				)
			  },
			}`,
					{ noop }
				)
			)
			expect(wrapper.vnode.data.props.onSuccess).toBe(noop)
			expect(wrapper.vnode.data.on.click.fns).toBe(noop)
			expect(wrapper.vnode.data.on.camelCase.fns).toBe(noop)
			expect(wrapper.vnode.data.domProps.innerHTML).toBe('<p>hi</p>')
			expect(wrapper.vnode.data.hook.insert).toBe(noop)
		})

		test('Supports data attribute', () => {
			const wrapper: any = shallowMount(
				getComponent(`{
			  render(h) {
				return <div data-id="1" />
			  },
			}`)
			)

			expect(wrapper.vnode.data.attrs['data-id']).toBe('1')
		})

		test('Handles identifier tag name as components', () => {
			const Test = { render: () => null }
			const wrapper: any = shallowMount(
				getComponent(
					`{
			  render(h) {
				return <Test />
			  },
			}`,
					{ Test }
				)
			)

			expect(wrapper.vnode.tag).toMatch(/^vue-component/)
		})

		test('Works for components with children', () => {
			const Test = {
				render(h: (b: string) => any) {
					h('div')
				}
			}
			const wrapper: any = shallowMount(
				getComponent(
					`{
				render(h) {
					return (
						<Test>
							<div>hi</div>
						</Test>
					)
				}
			}`,
					{ Test }
				)
			)
			const children = wrapper.vnode.componentOptions.children
			expect(children[0].tag).toBe('div')
		})

		test('Binds things in thunk with correct this context', () => {
			const Test = getComponent(`{
				render(h) {
					return <div>{this.$slots.default}</div>
				}
			}`)
			const wrapper: any = mount(
				getComponent(
					`{
			  data: () => ({ test: 'foo' }),
			  render(h) {
				return <Test>{this.test}</Test>
			  },
			}`,
					{ Test }
				)
			)

			expect(wrapper.html()).toBe('<div>foo</div>')
		})
	})
})
