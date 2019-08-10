import { EventDescriptor } from 'vue-docgen-api'
import { mdit } from './utils'

const tmpl = (events: { [eventName: string]: EventDescriptor }) => {
	let ret = ''
	Object.keys(events).forEach(i => {
		const { description, ...e } = events[i]
		const t = e.type && e.type.names ? e.type.names.join(' ') : ''
		ret += `| ${mdit(i)} | ${mdit(t)} | ${mdit(description)}\n`
	})
	return ret
}

export default (events: { [eventName: string]: EventDescriptor }): string => {
	if (Object.keys(events).length === 0) return ''

	return `
  ## Events
  | Event name     | Type        | Description  |
  | ------------- |------------- | -------------|
  ${tmpl(events)}
  `
}
