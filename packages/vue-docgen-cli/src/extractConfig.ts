import * as path from 'path'
import * as fs from 'fs'
import {
	component,
	events,
	methods,
	props,
	slots,
	defaultExample,
	functionalTag
} from './compileTemplates'
import { SafeDocgenCLIConfig, DocgenCLIConfig } from './config'
import { findFileCaseInsensitive } from './utils'

export default (
	cwd: string,
	watch: boolean = false,
	configFileFromCmd?: string,
	pathArray: string[] = []
): SafeDocgenCLIConfig => {
	const configFilePath = configFileFromCmd
		? path.resolve(cwd, configFileFromCmd)
		: path.join(cwd, 'docgen.config.js')
	const [componentsFromCmd, outDirFromCmd] = pathArray

	const config: Partial<DocgenCLIConfig> = {
		cwd,
		watch,
		componentsRoot: path.dirname(configFilePath),
		components: componentsFromCmd || 'src/components/**/[a-zA-Z]*.{vue,js,jsx,ts,tsx}',
		outDir: outDirFromCmd,
		getDocFileName: (componentPath: string): string | false => {
			const files = [
				path.join(path.dirname(componentPath), 'Readme.md'),
				// ComponentName.md
				componentPath.replace(path.extname(componentPath), '.md'),
				// FolderName.md when component definition file is index.js
				path.join(path.dirname(componentPath), path.basename(path.dirname(componentPath)) + '.md')
			]
			for (const file of files) {
				const existingFile = findFileCaseInsensitive(file)
				if (existingFile) {
					return existingFile
				}
			}
			return false
		},
		getDestFile: (file: string, config: SafeDocgenCLIConfig): string =>
			path.resolve(config.outDir, file).replace(/\.\w+$/, '.md'),
		editLinkLabel: 'edit on github',
		...(fs.existsSync(configFilePath) ? require(configFilePath) : undefined)
	}

	if (!config.getRepoEditUrl && config.docsRepo) {
		const branch = config.docsBranch || 'master'
		const dir = config.docsFolder || ''
		config.getRepoEditUrl = (p: string) => {
			return `https://github.com/${config.docsRepo}/edit/${branch}/${dir}/${p}`
		}
	}

	// only default outDir if `outFile` is null to avoid confusion
	config.outDir = config.outDir || (config.outFile ? '.' : 'docs')

	config.templates = {
		component,
		events,
		methods,
		props,
		slots,
		defaultExample,
		functionalTag,
		...config.templates
	}

	return config as SafeDocgenCLIConfig
}
