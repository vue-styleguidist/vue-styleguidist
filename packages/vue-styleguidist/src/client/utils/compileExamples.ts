import * as Rsg from 'react-styleguidist'
import { CodeExample } from '../../types/Example'

export default function(examples: (CodeExample | Rsg.MarkdownExample)[]) {
	examples.forEach(ex => {
		if (ex.type === 'code') {
			if (ex.compiled !== undefined && typeof ex.content === 'string') {
				const content = { raw: ex.content, compiled: ex.compiled }
				ex.content = content
			}
		}
	})
}
