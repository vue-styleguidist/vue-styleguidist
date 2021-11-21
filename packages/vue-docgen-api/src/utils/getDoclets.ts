import { visit, parse } from 'recast'
import * as bt from '@babel/types'
import type { NodePath } from 'ast-types/lib/node-path'
import { PrimitiveTypes } from 'vue-inbrowser-compiler-utils'
import { BlockTag, DocBlockTags, Param, TypeOfProp } from '../Documentation'
import buildParser from '../babel-parser'
import matchRecursiveRegExp from './matchRecursiveRegexp'
import getTypeFromAnnotation from './getTypeFromAnnotation'

const DOCLET_PATTERN = /^(?:\s+)?@(\w+)(?:$|\s((?:[^](?!^(?:\s+)?@\w))*))/gim

function getParamInfo(content: string, hasName: boolean) {
	content = content || ''
	const typeSlice = matchRecursiveRegExp(content, '{', '}')[0] || ''
	const param: Param =
		hasName || typeSlice.length ? { type: getTypeObjectFromTypeString(typeSlice) } : {}

	content = content.replace(`{${typeSlice}}`, '')

	if (hasName) {
		const nameSliceArray = /^ *(\w[\w-]+)?/.exec(content)
		if (nameSliceArray) {
			param.name = nameSliceArray[1]
		}

		if (param.name) {
			content = content.replace(new RegExp(`^ *${param.name}`), '')
		}
	}

	content = content.replace(/^ *-/, '')

	if (content.length) {
		param.description = content.trim()
	}

	return param
}

function getTypeObjectFromTypeString(typeSlice: string): TypeOfProp | undefined {
	if (PrimitiveTypes.includes(typeSlice as any)) {
		return {
			name: typeSlice
		} as TypeOfProp
	} else if (/\w+\|\w+/.test(typeSlice)) {
		return {
			name: 'union',
			elements: typeSlice
				.split('|')
				.map(type => getTypeObjectFromTypeString(type))
				.filter(type => type) as TypeOfProp[]
		}
	} else {
		try {
			const astFile = parse(`let __docgen_param__: ${typeSlice}`, {
				parser: buildParser({ plugins: ['typescript'] })
			})
			let typeAnnotation: NodePath | undefined = undefined
			visit(astFile, {
				visitVariableDeclarator(nodePath) {
					if (bt.isIdentifier(nodePath.value.id) && nodePath.value.id.name === `__docgen_param__`) {
						typeAnnotation = nodePath.get('id', 'typeAnnotation', 'typeAnnotation')
					}
					return false
				}
			})
			if (typeAnnotation) {
				return getTypeFromAnnotation(typeAnnotation)
			}
		} catch {
			// eat that error
		}
	}
}

const UNNAMED_TAG_TITLES = ['returns', 'throws', 'type']

const TYPED_TAG_TITLES = [
	'param',
	'arg',
	'argument',
	'property',
	'type',
	'returns',
	'throws',
	'prop',
	'binding',
	'type'
]
const ACCESS_TAG_TITLES = ['private', 'public']

/**
 * Given a string, this functions returns an object with
 * two keys:
 * - `tags` an array of tags {title: tagname, content: }
 * - `description` whatever is left once the tags are removed
 */
export default function getDocblockTags(str: string): DocBlockTags {
	const tags: BlockTag[] = []
	let match = DOCLET_PATTERN.exec(str)

	for (; match; match = DOCLET_PATTERN.exec(str)) {
		const title = match[1]
		if (TYPED_TAG_TITLES.indexOf(title) > -1) {
			tags.push({ title, ...getParamInfo(match[2], UNNAMED_TAG_TITLES.indexOf(title) < 0) })
		} else if (ACCESS_TAG_TITLES.indexOf(title) > -1) {
			tags.push({ title: 'access', content: title })
		} else {
			tags.push({ title, content: match[2] || true })
		}
	}

	const description = str.replace(DOCLET_PATTERN, '').trim()

	return { description, tags }
}
