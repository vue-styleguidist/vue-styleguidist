import getUrl from 'react-styleguidist/lib/client/utils/getUrl'
import flatten from 'lodash/flatten'
import { Component } from '../../types/Component'
import compileExamples from './compileExamples'

interface ComponentsAndFiles {
	exampleFileNames: string[]
	components: Component[]
}

export interface HrefOptions {
	hashPath?: string[]
	useRouterLinks: boolean
	useHashId?: boolean
}

/**
 * Do things that are hard or impossible to do in a loader: we don’t have access to component name
 * and props in the styleguide-loader because we’re using `require` to load the component module.
 *
 * @param {Array} components
 * @return {Array}
 */
export default function processComponents(
	{ exampleFileNames, components }: ComponentsAndFiles,
	{ useRouterLinks, useHashId, hashPath }: HrefOptions
): Component[] {
	return components.map(component => {
		const { props } = component
		const newComponent: Component = {
			...component,

			// Add .name shortcuts for names instead of .props.displayName.
			name: component.props.displayName,
			visibleName: component.props.visibleName || component.props.displayName,
			href:
				component.href ||
				getUrl({
					name: component.props.displayName,
					slug: component.slug,
					anchor: !useRouterLinks,
					hashPath: useRouterLinks ? hashPath : false,
					useSlugAsIdParam: useRouterLinks ? useHashId : false
				}),
			props: {
				...props,
				// Append @example doclet to all examples
				examples: [
					...(props.examples || []), //
					...flatten(props.example) //
				]
			}
		}

		if (component.subComponents) {
			component.subComponents.forEach(c => {
				// Add .name shortcuts for names instead of .props.displayName.
				c.name = c.props.displayName
				c.visibleName = c.props.visibleName || c.props.displayName
			})
		}

		newComponent.props && compileExamples(newComponent.props.examples || [])
		if (component.props && component.props.examplesFile) {
			const { examplesFile } = component.props
			exampleFileNames.push(examplesFile)
		}

		return newComponent
	})
}
