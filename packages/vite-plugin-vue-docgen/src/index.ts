import { Plugin } from 'vite'
import { parseMulti, DocGenOptions } from 'vue-docgen-api'

export { ComponentDoc } from 'vue-docgen-api'

export interface VitePluginDocgenOptions {
	docgenOptions?: DocGenOptions
	docQuery?: string
}

const DOCGEN_QUERY = 'docgen'

export default function PluginDocgen(options: VitePluginDocgenOptions = {}): Plugin {
	const { docgenOptions, docQuery = DOCGEN_QUERY } = options
	return {
		name: 'vite-plugin-vue-docgen',
		async resolveId(source, importer, options) {
			if (source.startsWith(`${docQuery}?`)) {
				const sourcePath = source.slice(docQuery.length + 1)
				const resolution = await this.resolve(sourcePath, importer, { skipSelf: true, ...options })
				// If it cannot be resolved, return `null` so that Rollup displays an error
				if (!resolution) return null
				return `${docQuery}?${resolution.id}`
			}
			return null
		},
		async load(id) {
			if (id.startsWith(`${docQuery}?`)) {
				const filePath = id.slice(docQuery.length + 1)
				const docgen = await parseMulti(filePath, docgenOptions)
				const output = `export default ${JSON.stringify(docgen, null, 2)}`
				return output
			}
			return null
		}
	}
}
