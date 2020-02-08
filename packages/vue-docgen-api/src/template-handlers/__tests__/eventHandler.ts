import { compile } from 'vue-template-compiler'
import Documentation from '../../Documentation'
import { traverse } from '../../parse-template'
import eventHandler from '../eventHandler'

describe('eventHandler', () => {
	let doc: Documentation
	beforeEach(() => {
		doc = new Documentation('dummy/path')
	})

	it('should match events calls in attributes expressions', done => {
		const ast = compile(
			[
				'<div>',
				'  <!--',
				'    trigered on click',
				'    @event click',
				'  -->',
				`  <button @click="$emit('click', 23, 1)"></button>`,
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [eventHandler], { functional: false, rootLeadingComment: [''] })
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

	it('should match events calls property', done => {
		const ast = compile(
			[
				'<div>',
				'  <!--',
				'    trigered on click',
				'    @event click',
				'    @property {object} demo - example',
				'    @property {number} called - test called',
				'  -->',
				`  <button @click="$emit('click', test)"></button>`,
				'</div>'
			].join('\n'),
			{ comments: true }
		).ast
		if (ast) {
			traverse(ast, doc, [eventHandler], { functional: false, rootLeadingComment: [''] })
			expect(doc.toObject().events).toMatchObject([
				{
					name: 'click',
					description: 'trigered on click',
					properties: [
						{
							description: 'example',
							name: 'demo'
						},
						{
							description: 'test called',
							name: 'called'
						}
					]
				}
			])
			done()
		} else {
			done.fail()
		}
	})
})
