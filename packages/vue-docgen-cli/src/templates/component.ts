import { ComponentDoc, ParamTag } from 'vue-docgen-api'
import { RenderedUsage, DocgenCLIConfig } from '../compileTemplates'

export default (
	renderedUsage: RenderedUsage,
	doc: ComponentDoc,
	config: DocgenCLIConfig,
	fileName: string
): string => {
	const { displayName, description, docsBlocks, tags } = doc

	const { deprecated, author, since, version, see, link } = tags

	return `${
		!config.outFile && deprecated
			? // to avoid having the squiggles in the left menu for deprecated items
			  // use the frontmatter feature of vuepress
			  `
---
title: ${displayName}
---`
			: ''
	}
  # ${deprecated ? `~~${displayName}~~` : displayName}

  ${deprecated ? `> **Deprecated** ${(deprecated[0] as ParamTag).description}\n` : ''}
  ${description ? '> ' + description : ''}
  
  ${author ? author.map(a => `Author: ${(a as ParamTag).description}\n`) : ''}
  ${since ? `Since: ${(since[0] as ParamTag).description}\n` : ''}
  ${version ? `Version: ${(version[0] as ParamTag).description}\n` : ''}
  ${see ? see.map(s => `[See](${(s as ParamTag).description})\n`) : ''}
  ${link ? link.map(l => `[See](${(l as ParamTag).description})\n`) : ''}

  ${renderedUsage.props}
  ${renderedUsage.methods}
  ${renderedUsage.events}
  ${renderedUsage.slots}
  ${docsBlocks ? '---\n' + docsBlocks.join('\n---\n') : ''}
  `
}
