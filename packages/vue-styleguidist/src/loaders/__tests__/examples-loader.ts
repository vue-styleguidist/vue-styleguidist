import { encode } from 'qss'
import examplesLoader from '../examples-loader'

/* eslint-disable no-new-func */

jest.mock('vue-inbrowser-compiler-utils', () => {
	return {
		isCodeVueSfc: (code: string) => /<script/.test(code)
	}
})

jest.mock('vue-docgen-api', () => {
	return {
		parse: (file: string) => ({ displayName: file }),
		getDefaultExample: () => 'default example',
		cleanName: (name: string) => name
	}
})

jest.mock('../utils/absolutize', () => (p: string) => p)

const query = {
	file: 'foo.vue',
	displayName: 'FooComponent',
	shouldShowDefaultExample: false
}

const getQuery = (options = {}) => encode({ ...query, ...options }, '?')

it('should return valid, parsable JS', done => {
	const exampleMarkdown = `
# header
	<div/>
text
\`\`\`
<span/>
\`\`\`
`
	const callback = (err: string, result: string) => {
		expect(() => new Function(result)).not.toThrow(SyntaxError)
		expect(result).toBeTruthy()
		done()
	}

	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		} as any,
		exampleMarkdown
	)
})

it('should replace all occurrences of __COMPONENT__ with provided query.displayName', done => {
	const exampleMarkdown = `
	<div>
		<__COMPONENT__>
			<span>text</span>
			<span>Name of component: __COMPONENT__</span>
		</__COMPONENT__>
		<__COMPONENT__ />
	</div>
	`

	const callback = (err: string, result: string) => {
		expect(result).not.toMatch(/__COMPONENT__/)
		const mth = result.match(/<div>(.*?)<\/div>/)
		expect(mth && mth[0]).toMatchInlineSnapshot(`

		<div>
		  \\n\\t
		  <foo.vue>
		    \\n\\t\\t
		    <span>
		      text
		    </span>
		    \\n\\t\\t
		    <span>
		      Name of component: foo.vue
		    </span>
		    \\n\\t
		  </foo.vue>
		  \\n\\tdefault example\\n
		</div>

	`)
		done()
	}

	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: getQuery({ shouldShowDefaultExample: true }),
			_styleguidist: {},
			addDependency: jest.fn()
		} as any,
		exampleMarkdown
	)
})

it('should pass updateExample function from config to chunkify', done => {
	const exampleMarkdown = `
\`\`\`jsx static
<h1>Hello world!</h2>
\`\`\`
	`
	const updateExample = jest.fn(props => props)
	const callback = () => {
		expect(updateExample).toHaveBeenCalledWith(
			{
				content: '<h1>Hello world!</h2>',
				settings: { static: true },
				lang: 'jsx'
			},
			'/path/to/foo/examples/file'
		)
		done()
	}

	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: getQuery({ customLangs: ['vue', 'jsx'] }),
			resourcePath: '/path/to/foo/examples/file',
			_styleguidist: {
				updateExample
			}
		} as any,
		exampleMarkdown
	)
})

it('should generate require map when require() is used', done => {
	const exampleMarkdown = `
	One:
\`\`\`
const _ = require('lodash');
<X/>
\`\`\`
	Two:
		<Y/>
	`
	const callback = (err: string, result: string) => {
		expect(result).toBeTruthy()
		expect(() => new Function(result)).not.toThrow(SyntaxError)
		expect(result).toMatch(`'lodash': require('lodash')`)
		done()
	}
	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		} as any,
		exampleMarkdown
	)
})

it('should generate require map when import is used', done => {
	const exampleMarkdown = `
	One:
\`\`\`
	import _ from 'lodash';
	<X/>
\`\`\`
	`
	const callback = (err: string, result: string) => {
		expect(result).toBeTruthy()
		expect(() => new Function(result)).not.toThrow(SyntaxError)
		expect(result).toMatch(`'lodash': require('lodash')`)
		done()
	}

	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		} as any,
		exampleMarkdown
	)
})

it('should work with multiple JSX element on the root level', done => {
	const exampleMarkdown = `
		<X/>
		<Y/>
	`
	const callback = (err: string, result: string) => {
		expect(result).toBeTruthy()
		expect(() => new Function(result)).not.toThrow(SyntaxError)
		done()
	}
	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		} as any,
		exampleMarkdown
	)
})

it('should works for any Markdown file, without a current component', done => {
	const exampleMarkdown = `
		import FooComponent from '../foo.js';
		<FooComponent/>`
	const callback = (err: string, result: string) => {
		expect(result).toBeTruthy()
		expect(() => new Function(result)).not.toThrow(SyntaxError)
		expect(result).not.toMatch('undefined')
		done()
	}
	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: '',
			_styleguidist: {}
		} as any,
		exampleMarkdown
	)
})

it('should import external dependency in a vue component example', done => {
	jest.mock('vue-inbrowser-compiler-utils', () => {
		return {
			isCodeVueSfc: () => true
		}
	})
	const exampleMarkdown = `
	One:
	
	\`\`\`
			<template>
				<div/>
			</template>
			<script>
				import _ from 'lodash';
				import FooComponent from '../foo.js';
				<FooComponent/>
			</script>
	\`\`\`
	
			`
	const callback = (err: string, result: string) => {
		expect(result).toBeTruthy()
		expect(result).toMatch(`'lodash': require('lodash')`)
		done()
	}
	examplesLoader.call(
		{
			async: () => callback,
			request: 'Readme.md',
			query: '',
			_styleguidist: {}
		} as any,
		exampleMarkdown
	)
})
