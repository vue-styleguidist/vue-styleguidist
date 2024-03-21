import * as path from 'path'
import * as fs from 'fs'

export default function resolveAliases(
	filePath: string,
	aliases: { [alias: string]: string | string[] | boolean },
	refDirName: string = ''
): string {
	const aliasKeys = Object.keys(aliases)
	let aliasResolved = null
	if (!aliasKeys.length) {
		return filePath
	}
	for (const aliasKey of aliasKeys) {
		const aliasValueWithSlash = aliasKey + '/'
		const aliasMatch = filePath.substring(0, aliasValueWithSlash.length) === aliasValueWithSlash
		const aliasValue = aliases[aliasKey]
		if (!aliasMatch || typeof aliasValue === 'boolean') {
			continue
		}
		if (!Array.isArray(aliasValue)) {
			aliasResolved = path.join(aliasValue, filePath.substring(aliasKey.length + 1))
			continue
		}
		for (const alias of aliasValue) {
			const absolutePath = path.resolve(refDirName, alias, filePath.substring(aliasKey.length + 1))

			if (fs.existsSync(absolutePath)) {
				aliasResolved = absolutePath
				break
			}
		}
	}
	return aliasResolved === null ? filePath : aliasResolved
}
