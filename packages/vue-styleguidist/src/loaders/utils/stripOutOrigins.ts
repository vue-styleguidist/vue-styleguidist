import { ComponentDoc } from 'vue-docgen-api'

/**
 * Remove all origin info from the docs object
 * @param docs will be mutated
 */
export default function stripOutOrigins(docs: ComponentDoc) {
	const allDescriptors = [
		...(docs.props || []),
		...(docs.methods || []),
		...(docs.slots || []),
		...(docs.events || [])
	]
	allDescriptors.forEach(p => {
		if (p.extends) {
			delete p.extends
		}
		if (p.mixin) {
			delete p.mixin
		}
	})
}
