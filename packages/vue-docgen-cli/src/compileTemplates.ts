import {
	parse,
	PropDescriptor,
	SlotDescriptor,
	MethodDescriptor,
	EventDescriptor,
	ComponentDoc,
	DocGenOptions
} from 'vue-docgen-api'
import events from './templates/events'
import methods from './templates/methods'
import slots from './templates/slots'
import props from './templates/props'
import component from './templates/component'

export { DocgenCLIConfig } from './extractConfig'
export { mdit } from './templates/utils'
export { events, methods, slots, props, component }

export interface Templates {
	props(props: { [propName: string]: PropDescriptor }): string
	slots(slots: { [slotName: string]: SlotDescriptor }): string
	methods(methods: MethodDescriptor[]): string
	events(events: { [eventName: string]: EventDescriptor }): string
	component(usage: RenderedUsage, doc: ComponentDoc): string
}

export interface RenderedUsage {
	props: string
	slots: string
	methods: string
	events: string
}

export default (
	absolutePath: string,
	templates: Templates,
	options?: DocGenOptions,
	extraMd?: string
): string => {
	const doc = parse(absolutePath, options)
	const { props, events, methods, slots } = doc

	const renderedUsage = {
		props: props ? templates.props(props) : '',
		slots: slots ? templates.slots(slots) : '',
		methods: methods ? templates.methods(methods) : '',
		events: events ? templates.events(events) : ''
	}

	if (extraMd) {
		doc.docsBlocks = [...(doc.docsBlocks || []), extraMd]
	}

	return templates.component(renderedUsage, doc)
}
