import { ComponentDoc } from 'vue-docgen-api'
import { SafeDocgenCLIConfig } from '../config'

export default function header(docs: ComponentDoc[], config: SafeDocgenCLIConfig): string {
	const [doc] = docs
	const { displayName, tags } = doc
	const frontMatter = []
	const { deprecated, requires } = tags || {}
	const isSubComponent = requires.length > 0
	if (!config.outFile && deprecated) {
		// to avoid having the squiggles in the left menu for deprecated items
		// use the frontmatter feature of vuepress
		frontMatter.push(`title: ${displayName}`)
	}

	if (isSubComponent) {
		// show more than one level on subcomponents
		frontMatter.push('sidebarDepth: 2')
	}

	return frontMatter.length
		? `
---
${frontMatter.join('\n')}
---`
		: ''
}
