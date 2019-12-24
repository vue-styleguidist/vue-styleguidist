import { ObjectPath } from './traverse'

const getOrCreateObjectAtPath = (obj: any, path: ObjectPath): any =>
	path.reduce((obj, pathItem, i) => {
		const r = obj[pathItem]
		if (r !== undefined) {
			return r
		}
		if (path.length > i) {
			if (typeof path[i + 1] === 'number') {
				obj[pathItem] = []
			}
			if (typeof path[i + 1] === 'string') {
				obj[pathItem] = {}
			}
		}
		return obj[pathItem]
	}, obj)

export default getOrCreateObjectAtPath
