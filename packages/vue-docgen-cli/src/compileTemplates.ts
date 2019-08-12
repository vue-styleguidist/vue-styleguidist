import {
	parse,
	PropDescriptor,
	SlotDescriptor,
	MethodDescriptor,
	EventDescriptor,
	ComponentDoc
} from 'vue-docgen-api'
import events from './templates/events'
import methods from './templates/methods'
import slots from './templates/slots'
import props from './templates/props'
import component from './templates/component'
import { DocgenCLIConfig } from './extractConfig'

export { mdclean } from './templates/utils'
export { DocgenCLIConfig }
export { events, methods, slots, props, component }
export { default as docgen } from './docgen'

export interface Templates {
	props(props: { [propName: string]: PropDescriptor }): string
	slots(slots: { [slotName: string]: SlotDescriptor }): string
	methods(methods: MethodDescriptor[]): string
	events(events: { [eventName: string]: EventDescriptor }): string
	component(
		usage: RenderedUsage,
		doc: ComponentDoc,
		config: DocgenCLIConfig,
		componentRelativePath: string
	): string
}

export interface RenderedUsage {
	props: string
	slots: string
	methods: string
	events: string
}

export default (
	absolutePath: string,
	config: DocgenCLIConfig,
	componentRelativePath: string,
	extraMd?: string
): string => {
	const { apiOptions: options, templates } = config
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

	return templates.component(renderedUsage, doc, config, componentRelativePath)
}
