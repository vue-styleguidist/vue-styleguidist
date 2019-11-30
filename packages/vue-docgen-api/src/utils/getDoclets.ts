import { BlockTag, DocBlockTags, Param, ParamType } from '../Documentation'
import matchRecursiveRegExp from './matchRecursiveRegexp'

const DOCLET_PATTERN = /^(?:\s+)?@(\w+)(?:$|\s((?:[^](?!^(?:\s+)?@\w))*))/gim

function getParamInfo(content: string, hasName: boolean) {
	content = content || ''
	const typeSlice = matchRecursiveRegExp(content, '{', '}')[0] || '*'
	const param: Param = { type: getTypeObjectFromTypeString(typeSlice) }

	content = content.replace(`{${typeSlice}}`, '')

	if (hasName) {
		const nameSliceArray = /^ *(\w+)?/.exec(content)
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

function getTypeObjectFromTypeString(typeSlice: string): ParamType {
	if (typeSlice === '' || typeSlice === '*') {
		return { name: 'mixed' }
	} else if (/\w+\|\w+/.test(typeSlice)) {
		return {
			name: 'union',
			elements: typeSlice.split('|').map(type => getTypeObjectFromTypeString(type))
		}
	} else {
		return {
			name: typeSlice
		}
	}
}

const TYPED_TAG_TITLES = [
	'param',
	'arg',
	'argument',
	'property',
	'type',
	'returns',
	'prop',
	'binding'
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
			tags.push({ title, ...getParamInfo(match[2], title !== 'returns') })
		} else if (ACCESS_TAG_TITLES.indexOf(title) > -1) {
			tags.push({ title: 'access', content: title })
		} else {
			tags.push({ title, content: match[2] || true })
		}
	}

	const description = str.replace(DOCLET_PATTERN, '').trim()

	return { description, tags }
}
