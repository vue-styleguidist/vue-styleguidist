import { ComponentDoc, ParamTag } from 'vue-docgen-api'
import { RenderedUsage } from '../compileTemplates'

export default (renderedUsage: RenderedUsage, doc: ComponentDoc): string => {
	const { displayName, description, docsBlocks, tags } = doc

	const { deprecated, author, since, version, see, link } = tags

	return `
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
