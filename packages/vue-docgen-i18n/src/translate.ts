import { ComponentDoc } from 'vue-docgen-api'
import traverse from './traverse'
import getOrCreateObjectAtPath from './getOrCreateObjectAtPath'

/**
 * Translates the given `ComponentDoc` object using provided translations
 * @param originalDoc
 * @param translations
 * @returns translated documentation
 */
export default function(
	originalDoc: ComponentDoc,
	translations: Record<string, any>
): ComponentDoc {
	traverse(originalDoc, (key, object, path) => {
		if (key === 'description') {
			const trans = getOrCreateObjectAtPath(translations, path)
			if (trans && trans.description) {
				getOrCreateObjectAtPath(originalDoc, path).description = trans.description
			}
		}
	})
	return originalDoc
}
