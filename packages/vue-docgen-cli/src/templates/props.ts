import type { PropDescriptor } from 'vue-docgen-api'
import { SubTemplateOptions } from '../compileTemplates'
import { mdclean } from './utils'
import { renderTags } from './tags'

const tmpl = (props: PropDescriptor[]): string => {
	let ret = ''

	props.forEach(pr => {
		const p = pr.name
		let t = pr.description ?? ''
		t += renderTags(pr.tags)
		const n = pr.type?.name ?? '-' + (pr.required ? ` (required)` : '')
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
