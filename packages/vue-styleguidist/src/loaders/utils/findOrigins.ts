import { ComponentDoc } from 'vue-docgen-api'

/**
 * Extract in an array all the path to the files
 * the documented component depends on
 * @param docs
 * @return array of relative file paths
 */
export default function findOrigins(docs: ComponentDoc): string[] {
	const allDescriptors = [
		...(docs.props || []),
		...(docs.methods || []),
		...(docs.slots || []),
		...(docs.events || [])
	]
	const originFilePaths: string[] = []
	allDescriptors.forEach(p => {
		if (p.extends && originFilePaths.indexOf(p.extends.path) < 0) {
			originFilePaths.push(p.extends.path)
		}
		if (p.mixin && originFilePaths.indexOf(p.mixin.path) < 0) {
			originFilePaths.push(p.mixin.path)
		}
	})
	return originFilePaths
}
