/**
 * derives the ui config from the `DocgenCLIConfig` interface
 */

const { createProgram, SyntaxKind } = require('typescript')

function getFirstCommmentIfExists(tags, propName) {
	if (!tags) return undefined
	const filteredTags = tags.filter(t => t.tagName.text === propName)
	return filteredTags.length ? filteredTags[0].comment : undefined
}

function convertDefaultValue(type, value) {
	if (type === 'boolean') {
		return value === 'true' ? true : value === 'false' ? false : undefined
	}
	return value
}

function parseConfigInterface(path, interfaceName) {
	const typesPath = require.resolve(path)
	const program = createProgram([typesPath], {})

	const source = program.getSourceFile(typesPath)

	const configInterface = source.statements.filter(
		s => s.kind === SyntaxKind.InterfaceDeclaration && s.name.text === interfaceName
	)[0]

	return configInterface.members.map(m => {
		// get only the last trailing comment block
		const jsDoc = m.jsDoc ? m.jsDoc[m.jsDoc.length - 1] : {}
		// all the comments non attched to a tag are kept as the message
		const message = jsDoc.comment

		// extract description from tags
		const description = getFirstCommmentIfExists(jsDoc.tags, 'description')

		// If type is not defined in uitype, we return the type from the source
		const type =
			getFirstCommmentIfExists(jsDoc.tags, 'uitype') ||
			source.text.slice(m.type.pos + 1, m.type.end)

		// default value converted to true values
		const def = convertDefaultValue(type, getFirstCommmentIfExists(jsDoc.tags, 'default'))

		return {
			type,
			message,
			description,
			default: def,
			name: m.name.text
		}
	})
}

module.exports = parseConfigInterface
