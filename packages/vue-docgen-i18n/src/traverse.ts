type Level = Record<string, any>
export type ObjectPath = (string | number)[]

const traverse = (
	obj: Level,
	handler: (k: string | number, obj: Level, path: ObjectPath) => void,
	path: ObjectPath = []
) => {
	if (typeof obj === 'object')
		Object.entries(obj).forEach(([key, subobj]) => {
			const subPath = [...path, key]
			if (Array.isArray(subobj)) {
				handler(key, subobj, path)
				subobj.forEach((level, i) => {
					handler(i, level, subPath)
					traverse(level, handler, [...subPath, i])
				})
			} else {
				handler(key, subobj, path)
				traverse(subobj, handler, subPath)
			}
		})
}

export default traverse
