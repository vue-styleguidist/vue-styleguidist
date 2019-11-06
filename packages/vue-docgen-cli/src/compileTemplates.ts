import { parse } from 'vue-docgen-api'
import events from './templates/events'
import methods from './templates/methods'
import slots from './templates/slots'
import props from './templates/props'
import component from './templates/component'
import defaultExample from './templates/defaultExample'
import functionalTag from './templates/functionalTag'
import { DocgenCLIConfig } from './config'

export { mdclean } from './templates/utils'
export { events, methods, slots, props, component, defaultExample, functionalTag }
export { default as docgen } from './docgen'

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
