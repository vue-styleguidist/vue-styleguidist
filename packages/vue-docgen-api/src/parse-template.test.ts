import parseTemplate from './parse-template'
import Documentation from './Documentation'

describe('parse-template', () => {
	let content = ''
	let doc: Documentation
	const path = 'file/path'
	beforeEach(() => {
		doc = new Documentation(path)
	})

	it('should parse components with multi head', () => {
		content = '<div></div><!-- comment -->'
		parseTemplate({ content, attrs: {} }, doc, [], { filePath: path, validExtends: () => true })
		expect(doc.toObject()).toMatchInlineSnapshot(`
			{
			  "description": "",
			  "displayName": undefined,
			  "events": undefined,
			  "exportName": undefined,
			  "expose": undefined,
			  "methods": undefined,
			  "props": undefined,
			  "slots": undefined,
			  "sourceFiles": [
			    "file/path",
			  ],
			  "tags": {},
			}
		`)
	})
})
