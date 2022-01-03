import { Plugin } from 'vite'
import { parseMulti, DocGenOptions } from 'vue-docgen-api'

export { ComponentDoc } from 'vue-docgen-api'

export interface VitePluginDocgenOptions {
	docgenOptions?: DocGenOptions
	docQuery?: string
}

const DOCGEN_QUERY = 'vue-docgen-api'

export default function PluginDocgen(options: VitePluginDocgenOptions = {}): Plugin {
	const { docgenOptions, docQuery = DOCGEN_QUERY } = options
	return {
		name: 'vite-plugin-vue-docgen',
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

				const docgen = await parseMulti(filePath, docgenOptions)
				const output = `export default ${JSON.stringify(docgen, null, 2)}`

				return output
			}
			return null
		},
		handleHotUpdate({ file, server }) {
			const { moduleGraph } = server
			const maybeModule = moduleGraph.getModulesByFile(`${file}.${docQuery}`)
			if (maybeModule) {
				return Array.from(maybeModule)
			}
			return null
		}
	}
}
