import { parse } from '@vue/compiler-sfc'
import { parse as esParse } from 'es-module-lexer/js'

/**
 *
 * @param {string} code
 * @returns
 */
export function parseImports(code) {
	const [imports] = esParse(code)
	return imports.reduce(
		(
			acc,
			{
				ss: statementStartIndex,
				s: moduleSpecifierStartIndex,
				e: moduleSpecifierEndIndexExclusive,
				n: source
			}
		) => {
			if (source) {
				let importClauseString = code
					.substring(statementStartIndex + `import`.length, moduleSpecifierStartIndex - 1)
					.trim()

				if (importClauseString.endsWith(`from`)) {
					importClauseString = importClauseString.substring(
						0,
						importClauseString.length - `from`.length
					)
				} else {
					const source = code.substring(moduleSpecifierStartIndex, moduleSpecifierEndIndexExclusive)
					acc[source] = {
						source
					}
				}

				const { defaultImport, namedImports } = parseImportClause(importClauseString)

				namedImports.forEach(({ imported, alias }) => {
					acc[alias] = {
						source,
						imported
					}
				})

				if (defaultImport) {
					acc[defaultImport] = {
						source,
						imported: 'default'
					}
				}
			}
			return acc
		},
		{}
	)
}

function parseImportClause(importClauseString) {
	const defaultImport = parseDefaultImport(importClauseString)
	const namedImports = parseNamedImports(importClauseString)
	return { defaultImport, namedImports }
}

function parseDefaultImport(importClauseString) {
	const defaultImport = importClauseString.match(/^[a-zA-Z0-9_]+/)
	return defaultImport ? defaultImport[0] : null
}

function parseNamedImports(importClauseString) {
	// find first { and last }
	const firstCurly = importClauseString.indexOf('{')
	const lastCurly = importClauseString.lastIndexOf('}')

	const namedImports = importClauseString
		.slice(firstCurly, lastCurly)
		.matchAll(/([a-zA-Z0-9_]+)(?:\s+as\s+([a-zA-Z0-9_]+))?/g)
	return Array.from(namedImports).map(([_, imported, alias]) => ({
		imported,
		alias: alias || imported
	}))
}

/**
 * @param {string} code
 * @returns {Record<string, { source: string; imported?: string }>} key=localName
 */
export const getImports = code => {
	if (/<\/script>/.test(code)) {
		const { descriptor, errors } = parse(code)

		if (errors.length) {
			console.error(errors)
		}

		if (descriptor?.script || descriptor?.scriptSetup) {
			return parseImports(
				descriptor?.script?.content ?? '' + '\n' + descriptor?.scriptSetup?.content ?? ''
			)
		}
	}
	return {}
}
