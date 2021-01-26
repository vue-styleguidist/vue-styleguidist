import { ParamTag, PropDescriptor, Tag } from 'vue-docgen-api'
import { mdclean } from './utils'
import { SubTemplateOptions } from '../compileTemplates'

function isTag(v: Tag | ParamTag): v is Tag {
	return !!(v as any).content
}

export const renderTags = (tags?: { [tag: string]: (Tag | ParamTag)[] }): string => {
	if (!tags) {
		return ''
	}
	return Object.entries(tags)
		.map(([tag, values]) => {
			return values.map(v => `<br/>\`@${tag}\` ${isTag(v) ? v.content : v.description}`).join('')
		})
		.join('')
}

const tmpl = (props: PropDescriptor[]): string => {
	let ret = ''

	props.forEach(pr => {
		const p = pr.name
		let t = pr.description ?? ''
		t += renderTags(pr.tags)
		const n = pr.type?.name ?? ''
		const v = pr.values?.map(pv => `\`${pv}\``).join(', ') ?? '-'
		const d = pr.defaultValue?.value ?? ''

		ret += `| ${mdclean(p)} | ${mdclean(t)} | ${mdclean(n)} | ${mdclean(v)} | ${mdclean(d)} |\n`
	})
	return ret
}

export default (props: PropDescriptor[], opt: SubTemplateOptions = {}): string => {
	return `
${opt.isSubComponent || opt.hasSubComponents ? '#' : ''}## Props

  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- | ----------- | --------- | ----------- | ----------- |
  ${tmpl(props)}
  `
}
