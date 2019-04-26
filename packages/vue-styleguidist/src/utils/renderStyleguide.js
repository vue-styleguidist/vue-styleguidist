import React from 'react'
import slots from 'rsg-components/slots'
import StyleGuide from 'rsg-components/StyleGuide'
import getRouteData from 'react-styleguidist/lib/client/utils/getRouteData'
import getPageTitle from 'react-styleguidist/lib/client/utils/getPageTitle'
import getComponentsFromSections from './getComponentsFromSections'
import globalizeComponent from './globalizeComponent'
import processSections from './processSections'
import { cleanComponentName } from '../../loaders/utils/cleanComponentName'

export const RenderJsxContext = React.createContext({})
export const VueComponentMapContext = React.createContext({})

/**
 * @param {object} styleguide An object returned by styleguide-loader
 * @param {number} codeRevision
 * @param {Location} [loc]
 * @param {Document} [doc]
 * @param {History} [hist]
 * @return {React.ReactElement}
 */
export default function renderStyleguide(
	styleguide,
	codeRevision,
	loc = window.location,
	doc = document,
	hist = window.history
) {
	const allSections = processSections(styleguide.sections)
	const components = getComponentsFromSections(allSections)

	const componentsMap = {}

	if (styleguide.config.locallyRegisterComponents) {
		// create a map of relativefilepath => Vue object
		// to load them only when demanded
		components.forEach(component => {
			componentsMap[component.filepath] = {
				displayName: cleanComponentName(component.props.displayName),
				...component.module
			}
		})
	} else {
		// Globalize all components, not just ones we see on the screen, to make
		// all components accessible to all examples
		components.forEach(component => globalizeComponent(component))
	}

	const { title, pagePerSection } = styleguide.config
	const { sections, displayMode } = getRouteData(allSections, loc.hash, pagePerSection)

	// Update page title
	doc.title = getPageTitle(sections, title, displayMode)

	// If the current hash location was set to just `/` (e.g. when navigating back from isolated view to overview)
	// replace the URL with one without hash, to present the user with a single address of the overview screen
	if (loc.hash === '#/') {
		const url = loc.pathname + loc.search
		hist.replaceState('', doc.title, url)
	}

	return (
		<VueComponentMapContext.Provider value={componentsMap}>
			<RenderJsxContext.Provider value={styleguide.renderRootJsx}>
				<StyleGuide
					codeRevision={codeRevision}
					config={styleguide.config}
					slots={slots(styleguide.config)}
					welcomeScreen={styleguide.welcomeScreen}
					patterns={styleguide.patterns}
					sections={sections}
					allSections={allSections}
					displayMode={displayMode}
					pagePerSection={pagePerSection}
				/>
			</RenderJsxContext.Provider>
		</VueComponentMapContext.Provider>
	)
}
