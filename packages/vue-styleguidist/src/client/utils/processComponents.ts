import { Component } from '../../types/Component'
import { Example } from '../../types/Example'

/**
 * Do things that are hard or impossible to do in a loader: we don’t have access to component name
 * and props in the styleguide-loader because we’re using `require` to load the component module.
 *
 * @param {Array} components
 * @return {Array}
 */
export default function processComponents(components: Component[]): Component[] {
	return components.map(component => {
		const newComponent = {
			...component,

			// Add .name shortcuts for names instead of .props.displayName.
			name: component.props.displayName,
			visibleName: component.props.visibleName || component.props.displayName,

			props: {
				...component.props,
				// Append @example doclet to all examples
				examples: [
					...((component.props.examples || []) as Example[]),
					...(component.props.example || [])
				]
			}
		}

		newComponent.props.examples.forEach(ex => {
			if (ex.type === 'code') {
				if (ex.compiled !== undefined && typeof ex.content === 'string') {
					const content = { raw: ex.content, compiled: ex.compiled }
					ex.content = content
				}
			}
		})

		return newComponent
	})
}
