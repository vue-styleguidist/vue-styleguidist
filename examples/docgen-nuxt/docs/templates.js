module.exports = {
	component: function component(
		renderedUsage,
		doc,
		config,
		fileName,
		requiresMd,
		{ isSubComponent, hasSubComponents }
	) {
		const { functional, displayName, description, docsBlocks, tags } = doc
		const { author, since, version, see, link, position, category } = tags || {}

		const frontMatter = []
		if (!isSubComponent) {
			frontMatter.push(`title: "${displayName}"`)
			// If a @position doclet has been specified, we can
			// use it in the frontMatter to order pages
			if (position) {
				frontMatter.push(`position: ${position[0].description}`)
			}
			// if component is decorated with an @category doclet we
			// use it to place it in this category, if empty we use "components"
			const cleanCategory = category ? category[0].description : 'components'
			frontMatter.push(`category: "${cleanCategory}"`)
		}

		return `${
			frontMatter.length
				? `---
${frontMatter.join('\n')}
---`
				: ''
		}

${isSubComponent || hasSubComponents ? `## ${displayName}` : ''}

${description}

${functional ? `- ${renderedUsage.functionalTag}` : ''}
${author ? author.map(a => `- **Author**: ${a.description}`) : ''}
${since ? `- **Since** ${since[0].description}` : ''}
${version ? `- **Version** ${version[0].description}` : ''}
${see ? see.map(s => `- [See](${s.description})`) : ''}
${link ? link.map(l => `- [See](${l.description})`) : ''}

${renderedUsage.props}
${renderedUsage.methods}
${renderedUsage.events}
${renderedUsage.slots}
${docsBlocks ? '---\n' + docsBlocks.join('\n---\n') : ''}
${requiresMd.length ? '---\n' + requiresMd.map(component => component.content).join('\n---\n') : ''}
`
	}
}
