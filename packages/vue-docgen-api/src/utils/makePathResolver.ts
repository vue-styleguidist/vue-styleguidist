import resolveAliases from '../utils/resolveAliases'
import resolvePathFrom from '../utils/resolvePathFrom'

export default function makePathResolver(
	refDirName: string,
	aliases?: { [alias: string]: string | false | string[] },
	modules?: string[]
): (filePath: string, originalDirNameOverride?: string) => string | null {
	return (filePath: string, originalDirNameOverride?: string) =>
		resolvePathFrom(resolveAliases(filePath, aliases || {}, refDirName), [
			originalDirNameOverride || refDirName,
			...(modules || [])
		])
}
