import { encode } from 'qss'
import examplesLoader from '../examples-loader'

/* eslint-disable no-new-func */

jest.mock('vue-inbrowser-compiler', () => {
	return {
		isCodeVueSfc: code => /<script/.test(code)
	}
})

const query = {
	file: '../foo.js',
	displayName: 'FooComponent',
	shouldShowDefaultExample: false
}

const getQuery = (options = {}) => encode({ ...query, ...options }, '?')

it('should return valid, parsable JS', () => {
	const exampleMarkdown = `
# header
	<div/>
text
\`\`\`
<span/>
\`\`\`
`
	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		},
		exampleMarkdown
	)

	expect(result).toBeTruthy()
	expect(() => new Function(result)).not.toThrow(SyntaxError)
})

it('should replace all occurrences of __COMPONENT__ with provided query.displayName', () => {
	const exampleMarkdown = `
<div>
	<__COMPONENT__>
		<span>text</span>
		<span>Name of component: __COMPONENT__</span>
	</__COMPONENT__>
	<__COMPONENT__ />
</div>
`

	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: getQuery({ shouldShowDefaultExample: true }),
			_styleguidist: {}
		},
		exampleMarkdown
	)
	expect(result).not.toMatch(/__COMPONENT__/)
	expect(result.match(/<div>(.*?)<\/div>/)[0]).toMatchInlineSnapshot(`

<div>
  \\n\\t
  <FooComponent>
    \\n\\t\\t
    <span>
      text
    </span>
    \\n\\t\\t
    <span>
      Name of component: FooComponent
    </span>
    \\n\\t
  </FooComponent>
  \\n\\t
  <FooComponent>
  </FooComponent>
  \\n
</div>

`)
})

it('should pass updateExample function from config to chunkify', () => {
	const exampleMarkdown = `
\`\`\`jsx static
<h1>Hello world!</h2>
\`\`\`
`
	const updateExample = jest.fn(props => props)
	examplesLoader.call(
		{
			request: 'Readme.md',
			query: getQuery(),
			resourcePath: '/path/to/foo/examples/file',
			_styleguidist: {
				updateExample
			}
		},
		exampleMarkdown
	)
	expect(updateExample).toHaveBeenCalledWith(
		{
			content: '<h1>Hello world!</h2>',
			settings: { static: true },
			lang: 'jsx'
		},
		'/path/to/foo/examples/file'
	)
})

it('should generate require map when require() is used', () => {
	const exampleMarkdown = `
One:
\`\`\`
		const _ = require('lodash');
		<X/>
\`\`\`
Two:
	<Y/>
`
	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		},
		exampleMarkdown
	)

	expect(result).toBeTruthy()
	expect(() => new Function(result)).not.toThrow(SyntaxError)
	expect(result).toMatch(`'lodash': require('lodash')`)
})

it('should generate require map when import is used', () => {
	const exampleMarkdown = `
One:
\`\`\`
		import _ from 'lodash';
	<X/>
\`\`\`
`
	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		},
		exampleMarkdown
	)

	expect(result).toBeTruthy()
	expect(() => new Function(result)).not.toThrow(SyntaxError)
	expect(result).toMatch(`'lodash': require('lodash')`)
})

it('should work with multiple JSX element on the root level', () => {
	const exampleMarkdown = `
	<X/>
	<Y/>
`
	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: getQuery(),
			_styleguidist: {}
		},
		exampleMarkdown
	)

	expect(result).toBeTruthy()
	expect(() => new Function(result)).not.toThrow(SyntaxError)
})

it('should works for any Markdown file, without a current component', () => {
	const exampleMarkdown = `
    import FooComponent from '../foo.js';
    <FooComponent/>`
	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: '',
			_styleguidist: {}
		},
		exampleMarkdown
	)

	expect(result).toBeTruthy()
	expect(() => new Function(result)).not.toThrow(SyntaxError)
	expect(result).not.toMatch('undefined')
})

it('should import external dependency in a vue component example', () => {
	jest.mock('vue-inbrowser-compiler', () => {
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
	const result = examplesLoader.call(
		{
			request: 'Readme.md',
			query: '',
			_styleguidist: {}
		},
		exampleMarkdown
	)

	expect(result).toBeTruthy()
	expect(result).toMatch(`'lodash': require('lodash')`)
})
