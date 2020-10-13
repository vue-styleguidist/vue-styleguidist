import { ComponentDoc } from 'vue-docgen-api'
import traverse from 'traverse'

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
	const trans = traverse(translations)
	return traverse(originalDoc).map(function() {
		if (this.key === 'description') {
			if (trans.has(this.path)) {
				this.update(trans.get(this.path))
			}
		}
	})
}
