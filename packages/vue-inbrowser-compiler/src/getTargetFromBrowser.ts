import { TransformOptions } from 'buble'
import { detect } from 'detect-browser'

const browser = detect()

function isBubleBrowser(name: string): name is 'chrome' | 'firefox' | 'safari' | 'ie' | 'edge' {
	return ['chrome', 'firefox', 'safari', 'ie', 'edge'].includes(name)
}

export default function getTargetFromBrowser(): TransformOptions['target'] {
	if (browser?.version && browser?.name) {
		if (isBubleBrowser(browser.name)) {
			return { [browser.name]: browser.version }
		}
	}
	return {}
}
