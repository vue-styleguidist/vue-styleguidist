import type { ExposeDescriptor, ParamTag, Tag } from 'vue-docgen-api'
import { SubTemplateOptions } from '../compileTemplates'
import { renderTags } from './tags'

const tmpl = function (expose: ExposeDescriptor[], subComponent: boolean) {
	let ret = ''

	expose.forEach(exp => {
		ret += `
${subComponent ? '#' : ''}### ${exp.name ? exp.name : ''}

  > ${exp.description || ''} ${renderTags(exp.tags?.reduce((acc, tag) => {
    acc[tag.title] = [tag]
    return acc
  }, {} as { [tag: string]: (Tag | ParamTag)[] })) || ''}

 `
	})
	return ret
}

export default (expose: ExposeDescriptor[], opt: SubTemplateOptions = {}): string => {
	if (Object.keys(expose).length === 0) {
		return ''
	}
	return `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Expose

  ${tmpl(expose, opt.isSubComponent || opt.hasSubComponents || false)}
  `
}
