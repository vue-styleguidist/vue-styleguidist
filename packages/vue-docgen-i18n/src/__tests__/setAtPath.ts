import traverse from 'traverse'
import setAtPath from '../setAtPath'

describe('getOrCreateObjectAtPath', () => {
	it('should create values', () => {
		const obj = { hello: { world: 0 }, baz: { array: ['one', 'two'] } }
		const pathArray = ['baz', 'bonjour', '0', 'three']
		expect(setAtPath(obj, pathArray, 'test')).toBeUndefined()
		expect(traverse(obj).get(pathArray)).toEqual('test')
	})
})
