import { PropDescriptor } from 'vue-docgen-api'
import { mdclean } from './utils'

const tmpl = (props: PropDescriptor[]): string => {
	let ret = ''

	props.forEach(pr => {
		const p = pr.name
		const n = pr.type && pr.type.name ? pr.type.name : ''
		const d = pr.defaultValue && pr.defaultValue.value ? pr.defaultValue.value : ''
		const v = pr.values ? pr.values.map(pv => `\`${pv}\``).join(', ') : '-'
		const t = pr.description ? pr.description : ''

		ret +=
			`| ${mdclean(p)} | ${mdclean(t)} | ${mdclean(n)} | ${mdclean(v)} | ${mdclean(d)} |` + '\n'
	})
	return ret
}

export default (props: PropDescriptor[]): string => {
	return `
  ## Props
  | Prop name     | Description | Type      | Values      | Default     |
  | ------------- |-------------| --------- | ----------- | ----------- |
  ${tmpl(props)}
  `
}
