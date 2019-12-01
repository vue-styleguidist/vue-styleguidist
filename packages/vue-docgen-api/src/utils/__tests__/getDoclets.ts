import getDocLets from '../getDoclets'

describe('getDoclets', () => {
	it('should convert tags', () => {
		const src = `@version 1.2.3`
		expect(getDocLets(src).tags).toMatchObject([{ title: 'version', content: '1.2.3' }])
	})

	it('should extract params', () => {
		const src = `@param HelloWorld - the param itself`
		expect(getDocLets(src).tags).toMatchObject([
			{ title: 'param', name: 'HelloWorld', description: 'the param itself' }
		])
	})

	it('should extract params types', () => {
		const src = `@param {string} HelloWorld - the param itself`
		expect(getDocLets(src).tags).toMatchObject([
			{ title: 'param', name: 'HelloWorld', type: { name: 'string' } }
		])
	})

	it('should extract params types only when alone', () => {
		const src = `@param {string}`
		expect(getDocLets(src).tags).toEqual([{ title: 'param', type: { name: 'string' } }])
	})

	it('should extract params description if no dash', () => {
		const src = `@param myParam the param itself`
		expect(getDocLets(src).tags).toMatchObject([
			{ title: 'param', name: 'myParam', description: 'the param itself' }
		])
	})

	it('should extract return description and type', () => {
		const src = `@returns {string} the compiled object`
		expect(getDocLets(src).tags).toMatchObject([
			{ title: 'returns', description: 'the compiled object', type: { name: 'string' } }
		])
	})

	it('should extract param description without the dash', () => {
		const src = `@param {string} - the compiled object`
		expect(getDocLets(src).tags).toMatchObject([
			{ title: 'param', description: 'the compiled object' }
		])
	})

	it('should extract param type with braces', () => {
		const src = `@param {{name: string, id: number}} user`
		expect(getDocLets(src).tags).toEqual([
			{ name: 'user', title: 'param', type: { name: '{name: string, id: number}' } }
		])
	})

	it('should extract description', () => {
		const src = ['awesome method', ' ', '@version 1.2.3'].join('\n')
		expect(getDocLets(src).description).toEqual('awesome method')
	})

	it('should extract access tag', () => {
		const src = ['awesome method', ' ', '@public'].join('\n')
		expect(getDocLets(src).tags).toEqual([{ content: 'public', title: 'access' }])
	})
})
