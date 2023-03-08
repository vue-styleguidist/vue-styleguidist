import { dirname, join, relative, sep } from 'path'
import { promises as fs } from 'fs'
import { ComponentDoc, Tag, ParamTag } from 'vue-docgen-api'
import { findFileCaseInsensitive, normalizePaths } from './utils'

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
	getDocFileName: (file: string) => string | string[] | false,
	rootPath: string,
	editLinkLabel: string,
	getRepoEditUrl?: (path: string) => string
): Promise<string[]> {
	const docsBlocks = doc.docsBlocks || []
	const docFilesPaths = normalizePaths(getDocFileName(absolutePath))

	const docFilePaths = docFilesPaths
		.map(p => (getRepoEditUrl ? findFileCaseInsensitive(p) : p))
		.filter(Boolean) as string[]

	await Promise.allSettled(
		docFilePaths.map(async docFilePath => {
			docsBlocks.push(`${
				getRepoEditUrl
					? `
<a href="${getRepoEditUrl(
							relativeUrl(rootPath, docFilePath)
					  )}" class="docgen-edit-link">${editLinkLabel}</a>
`
					: ''
			}
${await fs.readFile(docFilePath, 'utf8')}`)
		})
	)

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
${await fs.readFile(ep, 'utf8')}`)
				}
			})
		)
	}

	return docsBlocks
}

const separatorRE = new RegExp(`\\${sep}`, 'g')

function relativeUrl(rootPath: string, docFilePath: string): string {
	return relative(rootPath, docFilePath).replace(separatorRE, '/')
}

export function isParamTag(tag: ParamTag | Tag): tag is ParamTag {
	return !!(tag as ParamTag).description
}
