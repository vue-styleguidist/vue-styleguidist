import minimist from 'minimist'
import * as path from 'path'
import * as fs from 'fs'
import { DocGenOptions } from 'vue-docgen-api'
import { component, events, methods, props, slots, Templates } from './compileTemplates'

export interface DocgenCLIConfig {
	outDir: string
	outFile?: string
	components: string
	componentsRoot: string
	apiOptions?: DocGenOptions
	getDocFileName(componentPath: string): string
	getDestFile(file: string, config: DocgenCLIConfig): string
	watch: boolean
	templates: Templates
	cwd: string
	pages?: DocgenCLIConfig[]
}

export default (): DocgenCLIConfig => {
	const { _: pathArray, configFile: configFileFromCmd, watch, cwd: cwdFromCommand } = minimist(
		process.argv.slice(2),
		{
			alias: { c: 'configFile', w: 'watch' }
		}
	)
	const configFilePath = configFileFromCmd
		? path.resolve(process.cwd(), configFileFromCmd)
		: path.join(process.cwd(), 'docgen.config.js')
	const cwd = cwdFromCommand || process.cwd()
	const [componentsFromCmd, outDirFromCmd] = pathArray

	const config: DocgenCLIConfig = {
		cwd,
		watch,
		componentsRoot: path.dirname(configFilePath),
		components: componentsFromCmd || 'src/components/**/[a-zA-Z]*.{vue,js,jsx,ts,tsx}',
		outDir: outDirFromCmd || 'docs',
		getDocFileName: (componentPath: string) =>
			path.resolve(path.dirname(componentPath), 'Readme.md'),
		getDestFile: (file: string, config: DocgenCLIConfig): string =>
			path.resolve(config.outDir, file).replace(/\.\w+$/, '.md'),
		...(fs.existsSync(configFilePath) ? require(configFilePath) : undefined)
	}

	config.templates = {
		component,
		events,
		methods,
		props,
		slots,
		...config.templates
	}

	return config
}
