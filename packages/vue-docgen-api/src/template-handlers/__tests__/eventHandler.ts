import { compile } from 'vue-template-compiler'
import Documentation from '../../Documentation'
import { traverse } from '../../parse-template'
import eventHandler from '../eventHandler'

describe('eventHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation()
	})

	it('should match events calls in attributes expressions', done => {
		const ast = compile(
			[
				'<div>', //
				'  <!-- @event click trigered on click -->',
				`  <button @click="$emit('click')"></button>`, //
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [eventHandler], { functional: false, rootLeadingComment: '' })
			expect(doc.toObject().events).toMatchObject([
				{
					name: 'click',
					description: 'trigered on click'
				}
			])
			done()
		} else {
			done.fail()
		}
	})
})
