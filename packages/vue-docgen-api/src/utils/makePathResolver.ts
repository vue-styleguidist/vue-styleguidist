import resolveAliases from '../utils/resolveAliases'
import resolvePathFrom from '../utils/resolvePathFrom'

export default function makePathResolver(
	refDirName: string,
	aliases?: { [alias: string]: string },
	modules?: string[]
): (filePath: string, originalDirNameOverride?: string) => string {
	return (filePath: string, originalDirNameOverride?: string): string =>
		resolvePathFrom(resolveAliases(filePath, aliases || {}), [
			originalDirNameOverride || refDirName,
			...(modules || [])
		])
}
