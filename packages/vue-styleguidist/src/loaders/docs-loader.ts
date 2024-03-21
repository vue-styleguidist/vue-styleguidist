// https://vue-loader.vuejs.org/guide/custom-blocks.html#example
import { LoaderContext } from 'webpack'
import { RawSourceMap } from 'source-map'

export default function (this: LoaderContext<null>, source: string | Buffer, map?: RawSourceMap) {
	const cb = this.async()
	if (cb) {
		cb(
			null,
			`export default function (Component) {
        Component.options = Component.options || {}
        Component.options.__docs = ${JSON.stringify(source)}
      }`,
			String(map)
		)
	}
}
