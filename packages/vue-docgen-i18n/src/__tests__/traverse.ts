import traverse from '../traverse'

describe('traverse', () => {
	it('call the handler', () => {
		const handler = jest.fn()
		traverse({ hello: { world: 0 }, array: ['one', 'two'] }, handler)
		expect(handler).toHaveBeenCalledTimes(5)
	})
})
