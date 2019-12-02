import { Example } from '../../types/Example'

export default function(
	examples: string | { require: string; toAST: () => any } | Example[] | null | undefined
) {
	Array.isArray(examples) &&
		examples.forEach(ex => {
			if (ex.type === 'code') {
				if (ex.compiled !== undefined && typeof ex.content === 'string') {
					const content = { raw: ex.content, compiled: ex.compiled }
					ex.content = content
				}
			}
		})
}
