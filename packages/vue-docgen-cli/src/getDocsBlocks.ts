import { ComponentDoc, Tag, ParamTag } from 'vue-docgen-api'
import { readFile as rf } from 'fs'
import { promisify } from 'util'
import { dirname, join } from 'path'

const readFile = promisify(rf)

export function getExamplesFilePaths(tags: { [key: string]: (Tag | ParamTag)[] }, componentDirname: string): string[] {
	const exampleTags = [...(tags.example || []), ...(tags.examples || [])]

	return (
		exampleTags.map((exampleTag: ParamTag | Tag) =>
			isParamTag(exampleTag)
				? join(componentDirname, exampleTag.description as string)
				: join(componentDirname, exampleTag.content as string)
		) || []
	)
}

export default async function getDocsBlocks(
	absolutePath: string,
	doc: Pick<ComponentDoc, 'tags' | 'docsBlocks'>,
	getDocFileName: (file: string) => string | false
): Promise<string[]> {
	const docsBlocks = doc.docsBlocks || []

	const docFilePath = getDocFileName(absolutePath)
	if (docFilePath) {
		try {
			docsBlocks.push(await readFile(docFilePath, 'utf8'))
		} catch (e) {
			// eat error if file not found
		}
	}

	// load @examples tags into the docsBlocks
	if (doc.tags?.example || doc.tags?.examples) {
		const componentDirname = dirname(absolutePath)
		const examplesFilePaths = getExamplesFilePaths(doc.tags, componentDirname)
		await Promise.all(
			examplesFilePaths.map(async examplePath => {
				docsBlocks.push(await readFile(examplePath, 'utf8'))
			})
		)
	}

	return docsBlocks
}

export function isParamTag(tag: ParamTag | Tag): tag is ParamTag {
	return !!(tag as ParamTag).description
}
