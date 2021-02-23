import { ScriptTarget } from 'typescript'
import { detect } from 'detect-browser'

const browser = detect()

export default function getTargetFromBrowser(): ScriptTarget {
	return !browser?.name || browser?.name === 'ie' ? ScriptTarget.ES5 : ScriptTarget.ESNext
}
