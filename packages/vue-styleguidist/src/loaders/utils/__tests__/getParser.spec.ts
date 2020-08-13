import getParser from '../getParser'

var parseMock: jest.Mock
jest.mock('vue-docgen-api', () => {
	parseMock = jest.fn()
	return {
		parse: parseMock
	}
})

describe('getParser', () => {
	beforeEach(() => {
		parseMock.mockReset()
	})

	it('should return the an enriched parser function', () => {
		const parserFunc = getParser({ webpackConfig: {} })
		parserFunc('file1')
		expect(parseMock).toHaveBeenCalledWith('file1', {})
	})

	it('should return the default parser function', () => {
		const parserFunc = getParser({
			webpackConfig: { resolve: { modules: ['mod'], alias: { al: 'ias' } } }
		})
		parserFunc('file2')
		expect(parseMock).toHaveBeenCalledWith(
			'file2',
			expect.objectContaining({ modules: ['mod'], alias: { al: 'ias' } })
		)
	})

	it('should return options for pugParser', () => {
		const parserFunc = getParser({
			webpackConfig: {
				module: {
					rules: [
						{
							loader: 'pug-loader',
							options: {
								global: 'hello'
							}
						}
					]
				}
			}
		})
		parserFunc('file3')
		expect(parseMock).toHaveBeenCalledWith(
			'file3',
			expect.objectContaining({
				pugOptions: {
					global: 'hello'
				}
			})
		)
	})

	it('should return options for pugParser in use arrays', () => {
		const parserFunc = getParser({
			webpackConfig: {
				module: {
					rules: [
						{
							use: [
								{
									loader: 'pug-loader',
									options: {
										global: 'hello'
									}
								}
							]
						}
					]
				}
			}
		})
		parserFunc('file4')
		expect(parseMock).toHaveBeenCalledWith(
			'file4',
			expect.objectContaining({
				pugOptions: {
					global: 'hello'
				}
			})
		)
	})
})
