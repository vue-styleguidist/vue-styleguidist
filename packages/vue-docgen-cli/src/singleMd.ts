/* eslint-disable no-console */
import * as path from 'path'
import { FSWatcher } from 'chokidar'
import type { ComponentDoc } from 'vue-docgen-api'
import { writeDownMdFile } from './utils'
import { DocgenCLIConfigWithComponents } from './docgen'
import compileTemplates from './compileTemplates'
import { FileEventType } from './config'

export interface DocgenCLIConfigWithOutFile extends DocgenCLIConfigWithComponents {
	outFile: string
}

/**
 * Build one md file combining all documentations for components in files
 * if `config.watch` is true will keep on watch file changes
 * and update the current file if needed
 * @param files
 * @param watcher
 * @param config
 * @param _compile
 */
export default async function (
	files: string[],
	watcher: FSWatcher,
	config: DocgenCLIConfigWithOutFile,
	docMap: { [filepath: string]: string },
	_compile = compile
) {
	// This fileCache contains will, because it is
	// bound, the same along usage of this function.
	// it will contain
	// `key`: filePath of source component
	// `content`: markdown compiled for it
	const fileCache = {}
	const docsCache = {}
	const compileSingleDocWithConfig = (event: FileEventType, changedFilePath?: string) =>
		_compile(config, files, fileCache, docsCache, docMap, watcher, event, changedFilePath)

	await compileSingleDocWithConfig('init')

	if (config.watch) {
		watcher
			.on('add', (filePath) => {
				files.push(filePath)
				compileSingleDocWithConfig('add', filePath)
			})
			.on('change', compileSingleDocWithConfig.bind(null, 'change'))
			.on('unlink', compileSingleDocWithConfig.bind(null, 'delete'))
	}
}

/**
 * Compile all components in `files` into one single
 * markdown file and save it to the `config.outFile`
 * @param files the component files relative paths
 * @param config config passed to the current chunk
 * @param cachedContent in order to avoid re-parsing unchanged components pass an object where to store for future reference
 * @param docMap a map of each documentation file to the component they refer to
 * @param changedFilePath When in wtch mode, provide the relative path of the file that changes to only re-parse this file
 */
export async function compile(
	config: DocgenCLIConfigWithOutFile,
	files: string[],
	cachedContent: { [filepath: string]: string },
	cachedDocs: { [filepath: string]: ComponentDoc[] },
	docMap: { [filepath: string]: string },
	watcher: FSWatcher,
	event: FileEventType,
	changedFilePath?: string,
	fromWatcher: boolean = true
) {
	if (fromWatcher) {
		console.log(`[vue-docgen-cli] ${event} to ${changedFilePath} detected`)
	}

	// this local function will enrich the cachedContent with the
	// current components documentation
	const cacheMarkDownContent = async (filePath: string) => {
		const { content, dependencies, docs } = await compileTemplates(
			event,
			path.join(config.componentsRoot, filePath),
			config,
			filePath
		)

		dependencies.forEach(d => {
			watcher.add(d)
			docMap[d] = filePath
		})

		cachedContent[filePath] = content
		cachedDocs[filePath] = docs
		return true
	}

	if (changedFilePath) {
		// resolve the real component file path before updating if needed
		changedFilePath = docMap[changedFilePath] || changedFilePath
		try {
			// if in chokidar mode (watch), the path of the file that was just changed
			// is passed as an argument. We only affect the changed file and avoid re-parsing the rest
			await cacheMarkDownContent(changedFilePath)
		} catch (e) {
			if (config.watch) {
				console.error(
					'\x1b[31m%s\x1b[0m',
					`[vue-docgen-cli] Error compiling file ${config.outFile}:`
				)
				console.error(e)
			} else {
				const err = e as Error
				throw new Error(
					`Error compiling file ${config.outFile} when file ${changedFilePath} has changed: ${err.message}`
				)
			}
		}
	} else {
		try {
			// if we are initializing the current file, parse all components
			await Promise.all(files.map(cacheMarkDownContent))
		} catch (e) {
			if (config.watch) {
				console.error(
					'\x1b[31m%s\x1b[0m',
					`[vue-docgen-cli] Error compiling file ${config.outFile}:`
				)
				console.error(e)
			} else {
				const err = e as Error
				throw new Error(`[vue-docgen-cli] Error compiling file ${config.outFile}: ${err.message}`)
			}
		}
	}

	// first sort the updated cachedContent
	const sortedMd = Object.entries(cachedContent)
		.map(([filePath, mdValue]) => ({ filePath, mdValue, docs: cachedDocs[filePath] }))
		.sort(config.sortComponents)

	// and finally save all concatenated values to the markdown file
	await writeDownMdFile(
		sortedMd.map(part => part.mdValue),
		config.outFile
	)

	console.log(`[vue-docgen-cli] File ${config.outFile} updated.`)
}
