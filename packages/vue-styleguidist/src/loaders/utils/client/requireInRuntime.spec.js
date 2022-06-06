/* eslint-disable es5/no-modules,es5/no-block-scoping */
import requireInRuntime from './requireInRuntime'

const map = {
	a: 42,
	b: 43
}

it('should return a module from the map', function () {
	const result = requireInRuntime(map, null, 'a')
	expect(result).toBe(map.a)
})

it('should throw if module is not in the map', function () {
	const fn = function () {
		return requireInRuntime(map, null, 'c')
	}
	expect(fn).toThrowError('require() statements can be added')
})
