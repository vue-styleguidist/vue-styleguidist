#!/usr/bin/env node

import globby from 'globby'
import * as path from 'path'
import * as fs from 'fs'
import { promisify } from 'util'
import mkdirp from 'mkdirp'
import prettier from 'prettier'
import chokidar from 'chokidar'
import compileTemplates, { DocgenCLIConfig } from './compileTemplates'
import extractConfig from './extractConfig'

const writeFile = promisify(fs.writeFile)
const exists = promisify(fs.exists)
const readFile = promisify(fs.readFile)
const unlink = promisify(fs.unlink)

const writeDownMdFile = async (destFilePath: string, content: string) => {
	const prettyMd = prettier.format(content, { parser: 'markdown' })
	const destFolder = path.dirname(destFilePath)
	if (!(await fs.existsSync(destFolder))) {
		mkdirp.sync(destFolder)
	}

	await writeFile(destFilePath, prettyMd)
}

const compileMarkdown = async (config: DocgenCLIConfig, file: string): Promise<string> => {
	// compile a markdown file from a component and returnit as string
	const componentAbsolutePath = path.join(config.componentsRoot, file)
	const docFilePath = config.getDocFileName(componentAbsolutePath)
	const docExists = await exists(docFilePath)
	const doc = compileTemplates(
		componentAbsolutePath,
		config,
		file,
		docExists ? await readFile(docFilePath, 'utf8') : undefined
	)
	return doc
}

const compile = async (config: DocgenCLIConfig, filePath: string) => {
	const doc = await compileMarkdown(config, filePath)
	const destFilePath = config.getDestFile(filePath, config)
	writeDownMdFile(destFilePath, doc)
}

interface DocgenCLIConfigWithOutFile extends DocgenCLIConfig {
	outFile: string
}

const compileSingleDoc = async (
	conf: DocgenCLIConfigWithOutFile,
	files: string[],
	cachedContent: { [filepath: string]: string },
	changedFilePath?: string
) => {
	const setMarkDownContent = async (filePath: string) => {
		cachedContent[filePath] = await compileMarkdown(conf, filePath)
		return true
	}
	if (changedFilePath) {
		// if in chokidar mode (watch), the path of the file that was just changed
		// is passed as an argument. We only affect the changed file and avoid re-parsing the rest
		await setMarkDownContent(changedFilePath)
	} else {
		// if we are initializing the current file, parse all components
		await Promise.all(files.map(setMarkDownContent))
	}
	writeDownMdFile(conf.outFile, Object.values(cachedContent).join(''))
}

const compileDocs = async (config: DocgenCLIConfig) => {
	config.componentsRoot = path.resolve(config.cwd, config.componentsRoot)
	config.outDir = path.resolve(config.cwd, config.outDir)
	config.outFile = config.outFile ? path.resolve(config.outDir, config.outFile) : undefined

	// for every component file in the glob,
	const files = await globby(config.components, { cwd: config.componentsRoot })

	// create one big documentation file
	if (config.outFile) {
		const compileSingleDocWithConfig = compileSingleDoc.bind(null, config, files, {})
		compileSingleDocWithConfig()
		if (config.watch) {
			chokidar
				.watch(config.components, { cwd: config.componentsRoot })
				.on('add', compileSingleDocWithConfig)
				.on('change', compileSingleDocWithConfig)
		}
	} else {
		const compileWithConfig = compile.bind(null, config)

		// create one documentation file per component
		files.forEach(compileWithConfig)

		// run chokidar on the glob
		if (config.watch) {
			chokidar
				.watch(config.components, { cwd: config.componentsRoot })
				// on filechange, recompile the corresponding file
				.on('add', compileWithConfig)
				.on('change', compileWithConfig)
				// on file delete, delete corresponding md file
				.on('unlink', relPath => {
					unlink(config.getDestFile(relPath, config))
				})
		}
	}
}

const run = (config: DocgenCLIConfig) => {
	const { pages } = config
	if (pages) {
		// to avoid re-rendering the same pages
		delete config.pages
		pages.forEach(page => {
			const pageConf = { ...config, ...page }
			run(pageConf)
		})
	} else {
		compileDocs(config)
	}
}

const conf = extractConfig()
run(conf)
