/**
 * Return module from a given map (like {react: require('react')}) or throw.
 * We allow to require modules only from Markdown examples (won't work dynamically because we need to know all required
 * modules in advance to be able to bundle them with the code).
 */
export default function requireInRuntime(
	requireMap: Record<string, any>,
	importPath: string,
	filepath: string
): any {
	// since the require can be done in a remote file
	const requireLocalMap = (importPath ? requireMap[importPath] : requireMap) || {}
	if (!(filepath in requireLocalMap)) {
		throw new Error(
			'require() statements can be added only by editing a Markdown example file: require("' +
				filepath +
				'")'
		)
	}
	return requireLocalMap[filepath]
}
