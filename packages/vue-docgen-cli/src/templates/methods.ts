import { MethodDescriptor, Param } from 'vue-docgen-api'
import { mdit } from './utils'

const paramsTmpl = (params: Param[]): string => {
	let ret = `
  #### Params

  | Param name     | Type        | Description  |
  | ------------- |------------- | -------------|
  `

	params.forEach(p => {
		const t = p.type && p.type.name ? p.type.name : ''
		const n = p.name ? p.name : ''
		const d = p.description ? p.description : ''

		ret += `| ${mdit(n)} | ${mdit(t)} | ${mdit(d)} |\n`
	})

	return ret
}

const returnsTemplate = (ret: Param) => {
	const p = ret
	const t = p.type && p.type.name ? p.type.name : ''
	const d = p.description ? p.description : ''

	return `
  #### Return
  | Type        | Description  |
  | ------------- | -------------|
  | ${t} | ${d} |
  `
}

const tmpl = function(methods: MethodDescriptor[]) {
	let ret = ''

	methods.forEach(m => {
		ret += `
  ### ${m.name ? m.name : ''}
  > ${m.description || ''}

  ${m.params ? paramsTmpl(m.params) : ''}
  ${m.returns ? returnsTemplate(m.returns) : ''}
  `
	})
	return ret
}

export default (methods: MethodDescriptor[]): string => {
	if (Object.keys(methods).length === 0) return ''
	return `
  ## Methods
  ${tmpl(methods)}
  `
}
