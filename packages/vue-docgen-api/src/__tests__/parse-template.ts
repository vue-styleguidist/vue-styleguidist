import parseTemplate from '../parse-template'
import Documentation from '../Documentation'

describe('parse-template', () => {
	let content: string = ''
	let doc: Documentation
	const path = 'file/path'
	beforeEach(() => {
		doc = new Documentation(path)
	})

	it('figure it out', () => {
		parseTemplate({ content, attrs: {} }, doc, [], path)
		expect(true).toBeTruthy()
	})
})
