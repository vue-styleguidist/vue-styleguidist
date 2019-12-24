type Level = Record<string, any>
export type ObjectPath = (string | number)[]

const traverse = (
	obj: Level,
	handler: (k: string | number, obj: Level, path: ObjectPath) => void,
	path: ObjectPath = []
) => {
	Object.entries(obj).forEach(([key, subobj]) => {
		const subPath = [...path, key]
		if (Array.isArray(subobj)) {
			subobj.forEach((level, i) => {
				handler(i, level, subPath)
				traverse(level, handler, [...subPath, i])
			})
		} else {
			handler(key, subobj, subPath)
			traverse(subobj, handler, subPath)
		}
	})
}

export default traverse
