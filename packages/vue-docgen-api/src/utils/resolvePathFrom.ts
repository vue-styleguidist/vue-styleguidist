const SUFFIXES = ['', '.js', '.ts', '.vue', '/index.js', '/index.ts']

export default function resolvePathFrom(path: string, from: string[]): string {
  let finalPath = ''
  SUFFIXES.forEach(s => {
    if (!finalPath.length) {
      try {
        finalPath = require.resolve(`${path}${s}`, {
          paths: from,
        })
      } catch (e) {
        // eat the error
      }
    }
  })

  if (!finalPath.length) {
    throw new Error(
      `Neither '${path}.vue' nor '${path}.js', not even '${path}/index.js' or '${path}/index.ts' could be found in '${from}'`,
    )
  }

  return finalPath
}
