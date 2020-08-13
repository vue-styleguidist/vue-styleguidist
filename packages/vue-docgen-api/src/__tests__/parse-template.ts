import parseTemplate from '../parse-template'
import Documentation from '../Documentation'

describe('parse-template', () => {
	let content: string = ''
	let doc: Documentation
	const path = 'file/path'
	beforeEach(() => {
		doc = new Documentation(path)
	})

	it('should parse components with multi head', () => {
		content = '<div></div><!-- comment -->'
		parseTemplate({ content, attrs: {} }, doc, [], { filePath: path, validExtends: () => true })
		expect(doc.toObject()).toMatchInlineSnapshot(`
		Object {
		  "description": "",
		  "displayName": undefined,
		  "events": undefined,
		  "exportName": undefined,
		  "methods": undefined,
		  "props": undefined,
		  "slots": undefined,
		  "tags": Object {},
		}
	`)
	})
})
