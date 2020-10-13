export default (obj: any, path: string[], value: any) => {
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
		} else {
			currentLevelObject[pathItem] = value
		}
		return currentLevelObject[pathItem]
	}, obj)
}
