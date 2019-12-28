const getOrCreateObjectAtPath = (obj: any, path: string[], defaultValue?: any): any =>
	path.reduce((currentLevelObject, pathItem, i) => {
		const r = currentLevelObject[pathItem]
		if (r !== undefined) {
			return r
		}
		if (i < path.length - 1) {
			const nextPathItem = path[i + 1]
			const nextPathItemAsNumber = parseInt(nextPathItem, 10)
			if (!isNaN(nextPathItemAsNumber)) {
				currentLevelObject[pathItem] = []
			} else if (typeof path[i + 1] === 'string') {
				currentLevelObject[pathItem] = {}
			}
		} else if (defaultValue) {
			currentLevelObject[pathItem] = defaultValue
		}
		return currentLevelObject[pathItem]
	}, obj)

export default (obj: any, path: string[], value: any) => {
	const key = path[path.length - 1]
	const keyInt = parseInt(key, 10)
	const o = getOrCreateObjectAtPath(obj, path.slice(0, -1), isNaN(keyInt) ? {} : [])
	o[isNaN(keyInt) ? key : keyInt] = value
}
