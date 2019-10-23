import { PropDescriptor } from 'vue-docgen-api'
import { mdclean } from './utils'

const tmpl = (props: PropDescriptor[]): string => {
	let ret = ''

	props.forEach(pr => {
		const p = pr.name
		const n = pr.type && pr.type.name ? pr.type.name : ''
		const v = pr.defaultValue && pr.defaultValue.value ? pr.defaultValue.value : ''
		const d = pr.description ? pr.description : ''

		ret += `| ${mdclean(p)} | ${mdclean(n)} | ${mdclean(v)} | ${mdclean(d)} |` + '\n'
	})
	return ret
}

export default (props: PropDescriptor[]): string => {
	return `
  ## Props
  | Prop name     | Type        | Default  | Description  |
  | ------------- |-------------| ---------| -------------|
  ${tmpl(props)}
  `
}
