import { dirname, join, relative, sep } from 'path'
import { readFile as rf } from 'fs'
import { promisify } from 'util'
import { ComponentDoc, Tag, ParamTag } from 'vue-docgen-api'
import { findFileCaseInsensitive } from './utils'

const readFile = promisify(rf)

export function getExamplesFilePaths(
	tags: { [key: string]: (Tag | ParamTag)[] },
	componentDirname: string
): string[] {
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
	getDocFileName: (file: string) => string | false,
	rootPath: string,
	editLinkLabel: string,
	getRepoEditUrl?: (path: string) => string
): Promise<string[]> {
	const docsBlocks = doc.docsBlocks || []

	const docFilePath = getRepoEditUrl
		? findFileCaseInsensitive(getDocFileName(absolutePath) || '')
		: getDocFileName(absolutePath)
	if (docFilePath) {
		docsBlocks.push(`${
			getRepoEditUrl
				? `
<a href="${getRepoEditUrl(
						relativeUrl(rootPath, docFilePath)
				  )}" class="docgen-edit-link">${editLinkLabel}</a>
`
				: ''
		}
${await readFile(docFilePath, 'utf8')}`)
	}

	// load @examples tags into the docsBlocks
	if (doc.tags?.example || doc.tags?.examples) {
		const componentDirname = dirname(absolutePath)
		const examplesFilePaths = getExamplesFilePaths(doc.tags, componentDirname)
		await Promise.all(
			examplesFilePaths.map(async examplePath => {
				const ep = getRepoEditUrl ? findFileCaseInsensitive(examplePath) : examplePath
				if (ep) {
					docsBlocks.push(`${
						getRepoEditUrl
							? `
<a href="${getRepoEditUrl(relativeUrl(rootPath, ep))}" class="docgen-edit-link">${editLinkLabel}</a>
`
							: ''
					}
${await readFile(ep, 'utf8')}`)
				}
			})
		)
	}

	return docsBlocks
}

function relativeUrl(rootPath: string, docFilePath: string): string {
	return relative(rootPath, docFilePath).replace(sep, '/')
}

export function isParamTag(tag: ParamTag | Tag): tag is ParamTag {
	return !!(tag as ParamTag).description
}
