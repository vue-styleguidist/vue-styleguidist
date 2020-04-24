import { BlockTag, ParamTag, Tag } from '../Documentation'

export default function transformTagsIntoObject(tags: BlockTag[]): { [key: string]: BlockTag[] } {
	return tags.reduce((acc: { [key: string]: BlockTag[] }, tag) => {
		if (isContentTag(tag)) {
			const newTag: ParamTag = {
				description: tag.content,
				title: tag.title
			}
			tag = newTag
		}
		const title = tag.title === 'param' ? 'params' : tag.title
		if (acc[title]) {
			acc[title].push(tag)
		} else {
			acc[title] = [tag]
		}
		return acc
	}, {})
}

function isContentTag(tag: any): tag is Tag {
	return tag.content !== undefined
}
