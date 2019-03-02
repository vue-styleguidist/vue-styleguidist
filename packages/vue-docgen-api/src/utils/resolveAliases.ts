import * as path from 'path'

export default function resolveAliases(
	filePath: string,
	aliases: { [alias: string]: string }
): string {
	const aliasKeys = Object.keys(aliases)
	let i = aliasKeys.length
	let aliasFound = false
	if (!aliasKeys.length) {
		return filePath
	}
	while (!aliasFound && i--) {
		aliasFound = filePath.substring(0, aliasKeys[i].length) === aliasKeys[i]
	}
	if (!aliasFound) {
		return filePath
	}
	return path.join(aliases[aliasKeys[i]], filePath.substring(aliasKeys[i].length + 1))
}
