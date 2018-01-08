function processExamples(examples, vuex) {
	return examples.map(example => {
		if (example.type === 'code') {
			example.vuex = vuex;
		}
		return example;
	});
}

/**
 * Do things that are hard or impossible to do in a loader: we don’t have access to component name
 * and props in the styleguide-loader because we’re using `require` to load the component module.
 *
 * @param {Array} components
 * @param {String} vuex
 * @param {Number} level
 * @param {String} nameParent
 * @return {Array}
 */
export default function processComponents(components, vuex, level = 0, nameParent = '') {
	return components.map(component => {
		const newComponent = {
			...component,

			// Add .name shortcuts for names instead of .props.displayName.
			name: component.props.displayName,
			level,
			nameParent,
			props: {
				...component.props,
				// Append @example doclet to all examples
				examples: [...(component.props.examples || []), ...(component.props.example || [])],
			},
		};

		delete newComponent.props.example;
		newComponent.props.examples = processExamples(newComponent.props.examples, vuex);

		return newComponent;
	});
}
