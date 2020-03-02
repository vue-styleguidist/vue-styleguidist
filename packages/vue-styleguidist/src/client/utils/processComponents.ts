import { Component } from '../../types/Component'
import { Example } from '../../types/Example'
import compileExamples from './compileExamples'

interface ComponentsAndFiles {
	exampleFileNames: string[]
	components: Component[]
}

/**
 * Do things that are hard or impossible to do in a loader: we don’t have access to component name
 * and props in the styleguide-loader because we’re using `require` to load the component module.
 *
 * @param {Array} components
 * @return {Array}
 */
export default function processComponents({
	exampleFileNames,
	components
}: ComponentsAndFiles): Component[] {
	return components.map(component => {
		const newComponent: Component = {
			...component,

			// Add .name shortcuts for names instead of .props.displayName.
			name: component.props.displayName,
			visibleName: component.props.visibleName || component.props.displayName,

			props: {
				...component.props,
				// Append @example doclet to all examples
				examples: [
					...((component.props.examples || []) as Example[]),
					...(component.props.example || []).flat()
				]
			}
		}

		newComponent.props && compileExamples(newComponent.props.examples)
		if (component.props && component.props.examplesFile) {
			const { examplesFile } = component.props
			exampleFileNames.push(examplesFile)
		}

		return newComponent
	})
}
