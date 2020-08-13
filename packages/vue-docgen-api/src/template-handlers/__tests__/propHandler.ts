import { parse } from '@vue/compiler-dom'
import Documentation from '../../Documentation'
import { traverse } from '../../parse-template'
import propHandler from '../propHandler'

describe('slotHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation('dummy/path')
	})

	it('should match props in attributes expressions', done => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <!--',
				'    @prop {number} size width of the button',
				'    @prop {string} value value in the form',
				'   -->',
				'  <!-- separative comment -->',
				'  <button :style="`width:${props.size}`" :value="props.value"></button>',
				'</div>'
			].join('\n')
		)
		if (ast) {
			traverse(ast.children[0], doc, [propHandler], ast.children, {
				functional: true
			})
			expect(doc.toObject().props).toMatchObject([
				{ name: 'size', type: { name: 'number' }, description: 'width of the button' },
				{ name: 'value', type: { name: 'string' }, description: 'value in the form' }
			])
			done()
		} else {
			done.fail()
		}
	})

	it('should match props in interpolated text', done => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button style="width:200px">',
				'    <!-- @prop name Your Name -->',
				'    <!-- @prop {string} adress Your Adress -->',
				'    test {{props.name}} {{props.adress}}',
				'  </button>',
				'</div>'
			].join('\n')
		)
		if (ast) {
			traverse(ast.children[0], doc, [propHandler], ast.children, {
				functional: true
			})
			expect(doc.toObject().props).toMatchObject([
				{ name: 'name', type: { name: 'mixed' }, description: 'Your Name' },
				{ name: 'adress', type: { name: 'string' }, description: 'Your Adress' }
			])
			done()
		} else {
			done.fail()
		}
	})

	it('should not match props if in a string litteral', done => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button :style="`width:props.size`"></button>',
				'</div>'
			].join('\n')
		)
		if (ast) {
			traverse(ast.children[0], doc, [propHandler], ast.children, {
				functional: true
			})
			expect(doc.toObject().props).toBeUndefined()
			done()
		} else {
			done.fail()
		}
	})

	it('should not match props if in a non evaluated attribute', done => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button style="width:props.size"></button>',
				'</div>'
			].join('\n')
		)
		if (ast) {
			traverse(ast.children[0], doc, [propHandler], ast.children, {
				functional: true
			})
			expect(doc.toObject().props).toBeUndefined()
			done()
		} else {
			done.fail()
		}
	})

	it('should find props in object defined', done => {
		const ast = parse(
			[
				'<div>',
				'  <h1>titleof the template</h1>',
				'  <button :class="{',
				'	[$style.root]: true,',
				'	[$style.error]: props.error',
				'  }"></button>',
				'</div>'
			].join('\n')
		)
		if (ast) {
			traverse(ast.children[0], doc, [propHandler], ast.children, {
				functional: true
			})
			expect(doc.toObject().props).toMatchObject([{ name: 'error', type: {} }])
			done()
		} else {
			done.fail()
		}
	})
})
