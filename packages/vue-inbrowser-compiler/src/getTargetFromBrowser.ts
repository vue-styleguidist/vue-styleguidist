import { TransformOptions } from 'buble'
import { detect } from 'detect-browser'

const browser = detect()

const BROWSERS = {
	chrome: 71,
	firefox: 64,
	safari: 12,
	ie: 11,
	edge: 19
}

function isBubleBrowser(name: string): name is 'chrome' | 'firefox' | 'safari' | 'ie' | 'edge' {
	return name in BROWSERS
}

export default function getTargetFromBrowser(): TransformOptions['target'] {
	if (browser?.version && browser?.name) {
		if (isBubleBrowser(browser.name)) {
			const version = parseInt(browser.version, 10)
			return {
				[browser.name]: version <= BROWSERS[browser.name] ? version : BROWSERS[browser.name]
			}
		}
	}
	return {}
}
