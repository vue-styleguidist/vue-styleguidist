import * as path from 'path'
import * as fs from 'fs'
import { parseMulti } from 'vue-docgen-api'
import * as log from 'loglevel'
import {
	component,
	events,
	methods,
	expose,
	props,
	slots,
	defaultExample,
	functionalTag
} from './compileTemplates'
import { SafeDocgenCLIConfig, DocgenCLIConfig } from './config'
import { findFileCaseInsensitive } from './utils'

export default async (
	cwd: string,
	watch = false,
	configFileFromCmd?: string,
	pathArray: string[] = [],
	verbose = false,
	logLevel: log.LogLevelDesc = 'error'
): Promise<SafeDocgenCLIConfig> => {
	log.setLevel(logLevel)

	const configFilePath = configFileFromCmd
		? path.resolve(cwd, configFileFromCmd)
		: path.join(cwd, 'docgen.config.js')
	const [componentsFromCmd, outDirFromCmd] = pathArray

	log.debug('[vue-docgen-cli] extractConfig ', { configFilePath })

	const userConfigOrFunction = fs.existsSync(configFilePath)
		? (await import(`file://${configFilePath}`)).default
		: {}

	const rootConfig: Partial<DocgenCLIConfig> = {
		cwd,
		watch,
		propsParser: parseMulti,
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
		getDestFile: (file: string, conf: SafeDocgenCLIConfig): string =>
			path.resolve(conf.outDir, file).replace(/\.\w+$/, '.md'),
		editLinkLabel: 'edit on github'
	}

	const config =
		typeof userConfigOrFunction === 'function'
			? await Promise.resolve(userConfigOrFunction(rootConfig))
			: {
					...rootConfig,
					...userConfigOrFunction
			  }

	log.debug('[vue-docgen-cli]', { config })

	if (!config.getRepoEditUrl && config.docsRepo) {
		const branch = config.docsBranch || 'master'
		const dir = config.docsFolder || ''
		config.getRepoEditUrl = (p: string) => `https://github.com/${config.docsRepo}/edit/${branch}/${dir}/${p}`
	}

	// only default outDir if `outFile` is null to avoid confusion
	config.outDir = config.outDir || (config.outFile ? '.' : 'docs')

	config.verbose = config.verbose ?? verbose

	config.logLevel = config.logLevel ?? (logLevel as any)
	config.logLevel = config.logLevel ?? (config.verbose ? 'debug' : 'error')

	config.templates = {
		component,
		events,
		methods,
		props,
		slots,
		expose,
		defaultExample,
		functionalTag,
		...config.templates
	}

	return config as SafeDocgenCLIConfig
}
