import type { NodePath } from 'ast-types/lib/node-path'
import { visit } from 'recast'
import getTypeFromAnnotation from '../getTypeFromAnnotation'
import babylon from '../../babel-parser'

function parse(src: string): any {
	return babylon({ plugins: ['typescript'] }).parse(src)
}

function getAnnotation(code: string): NodePath {
	const ast = parse(`let a:${code};`)
	let ta: NodePath | undefined = undefined
	visit(ast, {
		visitTSTypeAnnotation(nodePath) {
			ta = nodePath.get('typeAnnotation')
			return false
		}
	})
	return ta as any
}

describe('getTypeFromAnnotation', () => {
	it('should extract type string', () => {
		expect(getTypeFromAnnotation(getAnnotation('string'))).toMatchInlineSnapshot(`
		Object {
		  "name": "string",
		}
	`)
	})

	it('should extract type array', () => {
		expect(getTypeFromAnnotation(getAnnotation('string[]'))).toMatchInlineSnapshot(`
		Object {
		  "elements": Array [
		    Object {
		      "name": "string",
		    },
		  ],
		  "name": "array",
		}
	`)
	})

	it('should extract identified type', () => {
		expect(getTypeFromAnnotation(getAnnotation('MetaType'))).toMatchInlineSnapshot(`
		Object {
		  "code": "MetaType",
		  "name": "code",
		}
	`)
	})

	it('should extract composed type', () => {
		expect(getTypeFromAnnotation(getAnnotation('MetaType<string>'))).toMatchInlineSnapshot(`
		Object {
		  "code": "MetaType<string>",
		  "name": "code",
		}
	`)
	})

	it('should extract explicit Array type', () => {
		expect(getTypeFromAnnotation(getAnnotation('Array<Book>'))).toMatchInlineSnapshot(`
		Object {
		  "elements": Array [
		    Object {
		      "code": "Book",
		      "name": "code",
		    },
		  ],
		  "name": "array",
		}
	`)
	})

	it('should extract union type', () => {
		expect(
			getTypeFromAnnotation(
				getAnnotation('"string literal" | 3 | Book | string[] | number[] | Book[] | Array<Book>')
			)
		).toMatchInlineSnapshot(`
		Object {
		  "elements": Array [
		    Object {
		      "name": "literal",
		      "value": "string literal",
		    },
		    Object {
		      "name": "literal",
		      "value": 3,
		    },
		    Object {
		      "code": "Book",
		      "name": "code",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "name": "string",
		        },
		      ],
		      "name": "array",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "name": "number",
		        },
		      ],
		      "name": "array",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "code": "Book",
		          "name": "code",
		        },
		      ],
		      "name": "array",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "code": "Book",
		          "name": "code",
		        },
		      ],
		      "name": "array",
		    },
		  ],
		  "name": "union",
		}
	`)
	})

	it('should extract intersection type', () => {
		expect(
			getTypeFromAnnotation(
				getAnnotation('"string literal" & 3 & Book & string[] & number[] & Book[] & Array<Book>')
			)
		).toMatchInlineSnapshot(`
		Object {
		  "elements": Array [
		    Object {
		      "name": "literal",
		      "value": "string literal",
		    },
		    Object {
		      "name": "literal",
		      "value": 3,
		    },
		    Object {
		      "code": "Book",
		      "name": "code",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "name": "string",
		        },
		      ],
		      "name": "array",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "name": "number",
		        },
		      ],
		      "name": "array",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "code": "Book",
		          "name": "code",
		        },
		      ],
		      "name": "array",
		    },
		    Object {
		      "elements": Array [
		        Object {
		          "code": "Book",
		          "name": "code",
		        },
		      ],
		      "name": "array",
		    },
		  ],
		  "name": "intersection",
		}
	`)
	})

	it('should extract capitalized types', () => {
		expect(getTypeFromAnnotation(getAnnotation('String'))).toMatchInlineSnapshot(`
		Object {
		  "name": "string",
		}
	`)
	})
})
