import { PropDescriptor } from 'vue-docgen-api'
import { mdclean } from './utils'

const tmpl = (props: { [propName: string]: PropDescriptor } = {}): string => {
	let ret = ''

	Object.keys(props).forEach(p => {
		const pr = props[p]
		const n = pr.type && pr.type.name ? pr.type.name : ''
		const v = pr.defaultValue && pr.defaultValue.value ? pr.defaultValue.value : ''
		const d = pr.description ? pr.description : ''

		ret += `| ${mdclean(p)} | ${mdclean(n)} | ${mdclean(v)} | ${mdclean(d)} |` + '\n'
	})
	return ret
}

export default (props: { [propName: string]: PropDescriptor }): string => {
	if (Object.keys(props).length === 0) return ''
	return `
  ## Props
  | Prop name     | Type        | Default  | Description  |
  | ------------- |-------------| ---------| -------------|
  ${tmpl(props)}
  `
}
