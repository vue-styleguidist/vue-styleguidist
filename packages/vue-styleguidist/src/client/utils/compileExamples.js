export default function (examples) {
	examples.forEach(ex => {
		if (ex.type === 'code') {
			if (ex.compiled !== undefined && typeof ex.content === 'string') {
				const content = { raw: ex.content, compiled: ex.compiled }
				ex.content = content
			}
		}
	})
}
