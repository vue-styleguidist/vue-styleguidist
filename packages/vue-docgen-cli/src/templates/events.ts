import { EventDescriptor } from 'vue-docgen-api'
import { mdclean } from './utils'

const tmpl = (events: EventDescriptor[]) => {
	let ret = ''
	events.forEach(evt => {
		const { description = '', ...e } = evt
		const t = e.type && e.type.names ? e.type.names.join(' ') : ''
		ret += `| ${mdclean(e.name)} | ${mdclean(t)} | ${mdclean(description)}\n`
	})
	return ret
}

export default (events: EventDescriptor[], subComponent = false): string => {
	return `
  ## Events
  | Event name     | Type        | Description  |
  | ------------- |------------- | -------------|
  ${tmpl(events)}
  `
}
