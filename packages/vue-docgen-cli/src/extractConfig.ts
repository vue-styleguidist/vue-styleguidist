import minimist from 'minimist'
import * as path from 'path'
import * as fs from 'fs'
import { DocGenOptions } from 'vue-docgen-api'
import {
	component,
	events,
	methods,
	props,
	slots,
	defaultExample,
	Templates
} from './compileTemplates'

export interface DocgenCLIConfig {
	defaultExamples?: boolean
	outDir: string
	outFile?: string
	components?: string | string[]
	componentsRoot: string
	apiOptions?: DocGenOptions
	getDocFileName(componentPath: string): string
	getDestFile(file: string, config: DocgenCLIConfig): string
	watch: boolean
	templates: Templates
	cwd: string
	pages?: DocgenCLIConfig[]
}

export default (processArgv: string[], processCwd: string): DocgenCLIConfig => {
	const { _: pathArray, configFile: configFileFromCmd, watch, cwd: cwdFromCommand } = minimist(
		processArgv.slice(2),
		{
			alias: { c: 'configFile', w: 'watch' }
		}
	)
	const configFilePath = configFileFromCmd
		? path.resolve(processCwd, configFileFromCmd)
		: path.join(processCwd, 'docgen.config.js')
	const cwd = cwdFromCommand || processCwd
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
		...config.templates
	}

	return config
}
