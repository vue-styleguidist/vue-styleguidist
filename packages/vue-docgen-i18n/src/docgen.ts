import { ComponentDoc } from 'vue-docgen-api'

interface AllTranslationsObjects {
	[component: string]: TranslationObject | AllTranslationsObjects
}

interface TranslationObject {
	original: string
	translation: string
}

function isTranslationObject(
	o: TranslationObject | AllTranslationsObjects
): o is TranslationObject {
	return !!o.original
}

const translateOneLayer = (
	layer: { [key: string]: string | any },
	translations: AllTranslationsObjects
) => {
	Object.keys(layer).forEach((p: string) => {
		const currentTrans = translations[p]
		if (typeof layer[p] === 'object' && !isTranslationObject(currentTrans)) {
			translateOneLayer(layer[p], currentTrans)
		} else if (
			isTranslationObject(currentTrans) &&
			layer[p].description === currentTrans.original
		) {
			layer[p].description = currentTrans.translation
		}
	}, {})
}

/**
 * Translates the given `ComponentDoc` object using provided translations
 * @param originalDoc
 * @param translations
 * @returns translated documentation
 */
export default function(
	originalDoc: ComponentDoc,
	translations: AllTranslationsObjects
): ComponentDoc {
	return originalDoc
}
