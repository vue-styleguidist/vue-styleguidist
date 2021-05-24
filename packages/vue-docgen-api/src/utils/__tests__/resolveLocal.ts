import resolveLocal from '../resolveLocal'
import babylon from '../../babel-parser'

describe('resolveLocal', () => {
	it('should resolve a variable local', () => {
		const ast = babylon().parse(`
		const mixin = {
			props: 'hello'
		}
		`)
		expect(resolveLocal(ast, ['mixin']).keys()).toEqual(['mixin'])
	})

	it('should resolve a variable local exported', () => {
		const ast = babylon().parse(`
		export const mixin = {
			props: 'hello'
		}
		`)
		expect(resolveLocal(ast, ['mixin']).keys()).toEqual(['mixin'])
	})

	it('should have pre-comment loaded', () => {
		const ast = babylon().parse(`
		/**
		 * Describe the current mixin
		 */
		const mixin = {
			props: 'hello'
		}
		`)
		const node = resolveLocal(ast, ['mixin']).get('mixin')?.parent.parent.node
		expect(node.leadingComments).toMatchObject([
			{
				type: 'CommentBlock',
				value: '*\n\t\t * Describe the current mixin\n\t\t '
			}
		])
	})
})
