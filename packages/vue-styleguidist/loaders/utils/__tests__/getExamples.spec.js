import getExamples from '../getExamples'

it('getExamples() should return require with examples-loader if component has example files', () => {
	const file = 'file.md'
	const examplesFile = __filename
	const result = getExamples(file, examplesFile)

	expect(result.require.includes(examplesFile)).toBe(true)
	expect(result.require.includes('componentName=')).toBe(false)
})

it('getExamples() should return require with examples-loader is component has examples', () => {
	const file = 'file.md'
	const examplesFile = 'foo'
	const fallbackName = 'Baz'
	const defaultExample = 'foo.js'
	const result = getExamples(file, examplesFile, fallbackName, defaultExample)

	expect(result.require.includes(__filename)).toBe(false)
	expect(result.require.includes(fallbackName)).toBe(true)
	expect(result.require.includes(defaultExample)).toBe(true)
	expect(result.require.includes('displayName=')).toBe(true)
})

it('getExamples() should return an empty array if component has no example file', () => {
	const file = 'file.md'
	const examplesFile = 'foo'
	const result = getExamples(file, examplesFile)

	expect(result).toEqual([])
})
