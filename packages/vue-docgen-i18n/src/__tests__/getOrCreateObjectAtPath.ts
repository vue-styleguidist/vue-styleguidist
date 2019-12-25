import { getOrCreateObjectAtPath } from '../getOrCreateObjectAtPath'

describe('getOrCreateObjectAtPath', () => {
	it('should create values', () => {
		const obj = { hello: { world: 0 }, baz: { array: ['one', 'two'] } }
		expect(getOrCreateObjectAtPath(obj, ['baz', 'bonjour', '0', 'test'])).toBeUndefined()
		expect(getOrCreateObjectAtPath(obj, ['baz', 'bonjour', '0'])).not.toBeUndefined()
	})
})
