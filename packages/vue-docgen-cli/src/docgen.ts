#!/usr/bin/env node

import globby from 'globby'
import * as path from 'path'
import * as fs from 'fs'
import mkdirp from 'mkdirp'
import prettier from 'prettier'
import chokidar from 'chokidar'
import compileTemplates, { DocgenCLIConfig } from './compileTemplates'
import extractConfig from './extractConfig'

const writeDownMdFile = (destFilePath: string, content: string) => {
	const prettyMd = prettier.format(content, { parser: 'markdown' })
	const destFolder = path.dirname(destFilePath)
	if (!fs.existsSync(destFolder)) {
		mkdirp.sync(destFolder)
	}

	fs.writeFile(destFilePath, prettyMd, err => {
		if (err) {
			throw err
		}
	})
}

const compileMarkdown = async (config: DocgenCLIConfig, file: string): Promise<string> => {
	// compile a markdown file in the dist folder. keep original scaffolding
	return new Promise(resolve => {
		const componentAbsolutePath = path.join(config.componentsRoot, file)
		const docFilePath = config.getDocFileName(componentAbsolutePath)
		fs.exists(docFilePath, exists => {
			const doc = compileTemplates(
				componentAbsolutePath,
				config.templates,
				config.apiOptions,
				exists ? fs.readFileSync(docFilePath, 'utf8') : undefined
			)
			resolve(doc)
		})
	})
}

const compile = async (config: DocgenCLIConfig, filePath: string) => {
	const doc = await compileMarkdown(config, filePath)
	const destFilePath = config.getDestFile(filePath, config)
	writeDownMdFile(destFilePath, doc)
}

const compileDocs = async (config: DocgenCLIConfig) => {
	config.componentsRoot = path.resolve(config.cwd, config.componentsRoot)
	config.outDir = path.resolve(config.cwd, config.outDir)
	config.outFile = config.outFile ? path.resolve(config.outDir, config.outFile) : undefined

	// for every component file in the glob,
	const files = await globby(config.components, { cwd: config.componentsRoot })

	// create one big documentation file
	if (config.outFile) {
		const compileSingleDoc = async () => {
			if (config.outFile) {
				const docArray = await Promise.all(
					files.map(async filePath => await compileMarkdown(config, filePath))
				)
				writeDownMdFile(config.outFile, docArray.join(''))
			}
		}
		compileSingleDoc()
		if (config.watch) {
			chokidar
				.watch(config.components, { cwd: config.componentsRoot })
				.on('add', compileSingleDoc)
				.on('change', compileSingleDoc)
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
					fs.unlink(config.getDestFile(relPath, config), err => {
						if (err) {
							throw err
						}
					})
				})
		}
	}
}

const run = (config: DocgenCLIConfig) => {
	const { pages } = config
	if (pages) {
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
