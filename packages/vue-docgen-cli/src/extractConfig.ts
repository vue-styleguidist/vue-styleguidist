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
import { DocgenCLIConfig } from './config'

export default (
	cwd: string,
	watch: boolean = false,
	configFileFromCmd?: string,
	pathArray: string[] = []
): DocgenCLIConfig => {
	const configFilePath = configFileFromCmd
		? path.resolve(cwd, configFileFromCmd)
		: path.join(cwd, 'docgen.config.js')
	const [componentsFromCmd, outDirFromCmd] = pathArray

	const config: DocgenCLIConfig = {
		cwd,
		watch,
		componentsRoot: path.dirname(configFilePath),
		components: componentsFromCmd || 'src/components/**/[a-zA-Z]*.{vue,js,jsx,ts,tsx}',
		outDir: outDirFromCmd,
		getDocFileName: (componentPath: string) =>
			path.resolve(path.dirname(componentPath), 'Readme.md'),
		getDestFile: (file: string, config: DocgenCLIConfig): string =>
			path.resolve(config.outDir, file).replace(/\.\w+$/, '.md'),
		...(fs.existsSync(configFilePath) ? require(configFilePath) : undefined)
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

	return config
}
