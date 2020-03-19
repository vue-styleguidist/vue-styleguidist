import * as path from 'path'
import traverse from 'traverse'
import { ComponentDoc } from './Documentation'

export function getTranslationsObjectFromFile(fullFilePath: string, translation: string) {
	const transFileName = `${path.basename(fullFilePath).replace(/\.\w+$/, '')}.${translation}.js`
	return require(path.join(path.dirname(fullFilePath), transFileName))
}

export function mergeTranslationsAsObject(docs: ComponentDoc, transObjects: any[]): ComponentDoc {
	const transObject = transObjects.find((tr: { name: string }) => tr.name === docs.exportName)
	traverse(transObject).forEach(function(traversedItem) {
		if (!traversedItem.description) {
			return
		}
		// if the element is in array
		if (this.key && !isNaN(parseInt(this.key, 10)) && this.parent) {
			if (!traversedItem.name) return
			// find path of array
			const arrayPath = this.parent.path
			// get element in doc
			let i = 0
			let obj = docs
			while (i < arrayPath.length) {
				obj = obj[arrayPath[i++]]
				// if element does not exist quit
				if (!obj) return
			}
			const arrayOfProps = obj
			const prop = arrayOfProps.find((p: any) => p.name === traversedItem.name)
			// update its description with the one provided
			if (traversedItem.description && prop) {
				prop.description = traversedItem.description
			}
		} else {
			const arrayPath = this.path
			// get element in doc
			let i = 0
			let obj = docs
			while (i < arrayPath.length) {
				obj = obj[arrayPath[i++]]
				// if element does not exist quit
				if (!obj) return
			}
			// update its description with the one provided
			if (traversedItem.description) {
				obj.description = traversedItem.description
			}
		}
	})
	return docs
}

export default function mergeTranslations(
	docs: ComponentDoc,
	fullFilePath: string,
	translation: string
): ComponentDoc {
	const transObjects = getTranslationsObjectFromFile(fullFilePath, translation)
	return mergeTranslationsAsObject(docs, transObjects)
}
