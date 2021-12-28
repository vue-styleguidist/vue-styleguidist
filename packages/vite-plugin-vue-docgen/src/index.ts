import { Plugin, ViteDevServer } from 'vite'
import { parseMulti, DocGenOptions } from 'vue-docgen-api'

export { ComponentDoc } from 'vue-docgen-api'

export interface VitePluginDocgenOptions {
	docgenOptions?: DocGenOptions
	docQuery?: string
}

const DOCGEN_QUERY = 'vue-docgen-api'

export default function PluginDocgen(options: VitePluginDocgenOptions = {}): Plugin {
	const { docgenOptions, docQuery = DOCGEN_QUERY } = options
	let server: ViteDevServer
	return {
		name: 'vite-plugin-vue-docgen',
		configureServer(_server) {
			server = _server
		},
		async resolveId(source, importer, options) {
			if (source.endsWith(`.${docQuery}`)) {
				const sourcePath = source.slice(0, -(docQuery.length + 1))
				const resolution = await this.resolve(sourcePath, importer, { skipSelf: true, ...options })
				// If it cannot be resolved, return `null` so that Rollup displays an error
				if (!resolution) return null
				return `${resolution.id}.${docQuery}`
			}
			return null
		},
		async load(id) {
			if (id.endsWith(`.${docQuery}`)) {
				const filePath = id.slice(0, -(docQuery.length + 1))

				// add docgen to hmr reactions
				const { moduleGraph } = server
				const docgenModule = moduleGraph.getModuleById(id)
				moduleGraph.fileToModulesMap.set(filePath, new Set([docgenModule]))

				const docgen = await parseMulti(filePath, docgenOptions)
				const output = `export default ${JSON.stringify(docgen, null, 2)}`

				return output
			}
			return null
		}
	}
}
