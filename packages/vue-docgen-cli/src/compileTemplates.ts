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
import defaultExample from './templates/defaultExample'
import functionalTag from './templates/functionalTag'
import { DocgenCLIConfig } from './extractConfig'

export { mdclean } from './templates/utils'
export { DocgenCLIConfig }
export { events, methods, slots, props, component, defaultExample, functionalTag }
export { default as docgen } from './docgen'

export interface Templates {
	props(props: PropDescriptor[]): string
	slots(slots: SlotDescriptor[]): string
	methods(methods: MethodDescriptor[]): string
	events(events: EventDescriptor[]): string
	component(
		usage: RenderedUsage,
		doc: ComponentDoc,
		config: DocgenCLIConfig,
		componentRelativePath: string
	): string
	defaultExample(doc: ComponentDoc): string
	functionalTag: string
}

export interface RenderedUsage {
	props: string
	slots: string
	methods: string
	events: string
	functionalTag: string
}

export default async (
	absolutePath: string,
	config: DocgenCLIConfig,
	componentRelativePath: string,
	extraMd?: string
): Promise<string> => {
	const { apiOptions: options, templates } = config
	const doc = await parse(absolutePath, options)
	const { props, events, methods, slots } = doc

	const renderedUsage = {
		props: props ? templates.props(props) : '',
		slots: slots ? templates.slots(slots) : '',
		methods: methods ? templates.methods(methods) : '',
		events: events ? templates.events(events) : '',
		functionalTag: templates.functionalTag
	}

	if (extraMd && extraMd.length) {
		doc.docsBlocks = [...(doc.docsBlocks || []), extraMd]
	} else if (!doc.docsBlocks && config.defaultExamples) {
		doc.docsBlocks = [templates.defaultExample(doc)]
	}

	return templates.component(renderedUsage, doc, config, componentRelativePath)
}
