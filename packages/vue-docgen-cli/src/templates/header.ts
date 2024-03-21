import { ComponentDoc } from 'vue-docgen-api'
import { SafeDocgenCLIConfig } from '../config'

export default function header(
	docs: ComponentDoc[],
	config: SafeDocgenCLIConfig,
	hasSubComponent: boolean,
	componentRelativePath: string
): string {
	const frontMatter = []

	const fileNameRoot = componentRelativePath.split('/').pop()?.split('.').shift() || 'Component'

	if (docs.length === 1) {
		const [doc] = docs
		const { displayName, tags } = doc
		const { deprecated } = tags || {}
		if (!config.outFile && deprecated) {
			// to avoid having the squiggles in the left menu for deprecated items
			// use the frontmatter feature of vuepress
			frontMatter.push(`title: ${displayName}`)
		}
	}

	if (hasSubComponent) {
		// show more than one level on subcomponents
		frontMatter.push('sidebarDepth: 2')
	}

	return frontMatter.length
		? `
---
${frontMatter.join('\n')}
---
${docs.length > 1 ? `# ${fileNameRoot}\n` : ''}
`
		: ''
}
