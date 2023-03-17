import type { Tag, ParamTag } from "vue-docgen-api"

function isTag(v: Tag | ParamTag): v is Tag {
	return !!(v as any).content
}

export const renderTags = (tags?: { [tag: string]: (Tag | ParamTag)[] }): string => {
	if (!tags) {
		return ''
	}
	return Object.entries(tags)
		.map(([tag, values]) => {
      if(tag === 'type') return ''
			return values.map(v => `<br/>\`@${tag}\` ${isTag(v) ? v.content : v.description}`).join('')
		})
		.join('')
}