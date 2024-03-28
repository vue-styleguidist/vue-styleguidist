import resolveAliases from '../utils/resolveAliases'
import resolvePathFrom from '../utils/resolvePathFrom'

export default function makePathResolver(
	refDirName: string,
	aliases?: { [alias: string]: string | string[] | boolean },
	modules?: string[]
): (filePath: string, originalDirNameOverride?: string) => string | null {
	/**
	 * Emulate the module import logic as much as necessary to resolve a module containing the
	 * interface or type.
	 *
	 * @param base Path to the file that is importing the module
	 * @param module Relative path to the module
	 * @returns The absolute path to the file that contains the module to be imported
	 */
	return (filePath: string, originalDirNameOverride?: string) =>
		resolvePathFrom(resolveAliases(filePath, aliases || {}, refDirName), [
			originalDirNameOverride || refDirName,
			...(modules || [])
		])
}
