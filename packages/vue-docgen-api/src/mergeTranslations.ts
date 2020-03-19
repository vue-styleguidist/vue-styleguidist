import * as path from 'path'
import merge from 'lodash/merge'
import { ComponentDoc } from './Documentation'

export default function mergeTranslations(
	docs: ComponentDoc,
	fullFilePath: string,
	translation: string
): ComponentDoc {
	const transFileName = `${path.basename(fullFilePath).replace(/\.\w+$/, '')}.${translation}.js`
	const transObject = require(path.join(path.dirname(fullFilePath), transFileName))
	// TODO: account for misordering of names
	// => for each member of an array, look for correspondance of "name"
	// => traverse transObject and for each object in an array find the proper place to put it,
	// then remove array from transObject and merge what remains
	return merge(docs, transObject)
}
