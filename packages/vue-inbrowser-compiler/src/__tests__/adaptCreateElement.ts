import { transform } from 'buble'
import { shallowMount } from '@vue/test-utils'
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
		const getComponent = (code: string): { [key: string]: any } => {
			const compiledCode = transform('const a = ' + code, { jsx: '__pragma__(h)' }).code
			const getValue = new Function('__pragma__', 'text', compiledCode + ';return a;')
			const text = 'foo'
			return getValue(adaptCreateElement, text)
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
			const wrapper = shallowMount(
				getComponent(`{
					render(h) {
						return <div>{text}</div>
					}
				}`)
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
			const wrapper = shallowMount(
				getComponent(`{
					render(h) {
					  return <div id={text} />
					},
				  }`)
			)

			expect(wrapper.element.id).toBe('foo')
		})

		test('Omits attrs if possible', () => {
			const wrapper = shallowMount(
				getComponent(`{
					render(h) {
					  return <div>test</div>
					},
				  }`)
			)

			expect((wrapper as any).vnode.data).toBeUndefined()
		})

		test('Omits children if possible', () => {
			const wrapper = shallowMount(
				getComponent(`{
				render(h) {
				  return <div/>
				},
			  }`)
			)

			expect((wrapper as any).vnode.children).toBeUndefined()
		})
	})
})
