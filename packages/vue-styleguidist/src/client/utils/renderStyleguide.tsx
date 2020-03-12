import * as React from 'react'
import slots from 'rsg-components/slots'
import StyleGuide from 'rsg-components/StyleGuide'
import hashSum from 'hash-sum'
import getRouteData from 'react-styleguidist/lib/client/utils/getRouteData'
import getPageTitle from 'react-styleguidist/lib/client/utils/getPageTitle'
import { StyleGuideObject } from '../../types/StyleGuide'
import getComponentsFromSections from './getComponentsFromSections'
import globalizeComponent from './globalizeComponent'
import processSections from './processSections'

export const RenderJsxContext = React.createContext<React.ReactNode>(<div />)
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
	styleguide: StyleGuideObject,
	codeRevision: number,
	loc = window.location,
	doc = document,
	hist = window.history
) {
	const exampleFileNames: string[] = []
	const allSections = processSections({ sections: styleguide.sections, exampleFileNames })

	if (!styleguide.config.locallyRegisterComponents) {
		// Globalize all components, not just ones we see on the screen, to make
		// all components accessible to all examples
		const components = getComponentsFromSections(allSections)
		components.forEach(component => globalizeComponent(component))
	}

	const { title, pagePerSection, theme, styles } = styleguide.config
	const { sections, displayMode } = getRouteData(allSections as any, loc.hash, pagePerSection)

	// Update page title
	doc.title = getPageTitle(sections, title || '', displayMode)

	// If the current hash location was set to just `/` (e.g. when navigating back from isolated view to overview)
	// replace the URL with one without hash, to present the user with a single address of the overview screen
	if (loc.hash === '#/') {
		const url = loc.pathname + loc.search
		hist.replaceState('', doc.title, url)
	}

	return (
		<RenderJsxContext.Provider value={styleguide.renderRootJsx}>
			<StyleGuide
				codeRevision={codeRevision}
				// only caclulate css revisions in dev when hot is on to avoid
				// stringifying the styles in production
				cssRevision={hashSum({ theme, styles })}
				config={styleguide.config as any}
				slots={slots(styleguide.config as any)}
				welcomeScreen={styleguide.welcomeScreen}
				patterns={styleguide.patterns}
				sections={sections}
				allSections={allSections as any}
				displayMode={displayMode}
				pagePerSection={pagePerSection}
			/>
		</RenderJsxContext.Provider>
	)
}
