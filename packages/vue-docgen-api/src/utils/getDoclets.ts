import { BlockTag, DocBlockTags, Param, ParamType } from '../Documentation'
import matchRecursiveRegExp from './matchRecursiveRegexp'

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

/**
 * This is used to ignore the name tag if it does not make sense
 */
const UNNAMED_TAG_TITLES = ['returns', 'throws', 'type']

/**
 * For those arguments we will try and parse type of the content
 */
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

/**
 * These tags don't have content and we push them as 'access'
 */
const ACCESS_TAG_TITLES = ['private', 'public']

/**
 * If one of these tags is placed above content
 * the content is still taken as the description
 * they are usually placed at the top of the docblock
 */
const PREFIX_TAG_TITLES = ['slot', 'ignore']

/**
 * Given a string, this functions returns an object with
 * two keys:
 * - `tags` an array of tags {title: tagname, content: }
 * - `description` whatever is left once the tags are removed
 */
export default function getDocblockTags(str: string): DocBlockTags {
  const DOCLET_PATTERN = /^(?:\s+)?@(\w+) ?(.+)?/
	const tags: BlockTag[] = []
  const lines = str.split('\n').reverse()
  let accNonTagLines = ''
  lines.forEach(line => {
    let [, title, tagContents] = DOCLET_PATTERN.exec(line) || []


    if(!title) {
      accNonTagLines = line + '\n' + accNonTagLines
      return
    }

    if (TYPED_TAG_TITLES.includes(title)) {
      tags.push({ title, ...getParamInfo(tagContents, !UNNAMED_TAG_TITLES.includes(title)) })
    } else if (ACCESS_TAG_TITLES.indexOf(title) > -1) {
      tags.push({ title: 'access', content: title })
      return
    } else if (PREFIX_TAG_TITLES.indexOf(title) > -1) {
      tags.push({ title, content: tagContents ?? true })
      return
    } else {
      const content = tagContents 
        ? (tagContents + '\n' + accNonTagLines).trim()
        : accNonTagLines 
          ? accNonTagLines.trim()
          : true
      tags.push({ title, content })
    }

    accNonTagLines = ''
  })

	const description = accNonTagLines.trim().length ? accNonTagLines.trim() : undefined 

	return { description, tags: tags.reverse() }
}
