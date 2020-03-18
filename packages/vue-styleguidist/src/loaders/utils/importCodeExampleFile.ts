import * as fs from 'fs'
import * as path from 'path'
import * as Rsg from 'react-styleguidist'

/**
 * Extract example from file
 */
const importRE = /^\[import\]\(([./\w]+)\)/

export default function importCodeExampleFile(
	example: Pick<Rsg.CodeExample, 'content' | 'lang' | 'settings'>,
	mdPath: string,
	wp: any
): Pick<Rsg.CodeExample, 'content' | 'lang' | 'settings'> {
	const lang = importRE.exec(example.lang || '')
	if (lang) {
		const filePath = lang[1]
		const absoluteFilePath = path.resolve(path.dirname(mdPath), filePath)
		wp.addDependency(absoluteFilePath)
		example.content = fs.readFileSync(absoluteFilePath, 'utf8')
		example.lang = path.extname(filePath).slice(1)

		const folderPath = path.dirname(filePath)
		if (folderPath !== '.') {
			example.settings = { ...example.settings, importpath: folderPath }
		}
	}
	return example
}
