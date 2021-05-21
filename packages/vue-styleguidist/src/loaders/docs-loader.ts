// https://vue-loader.vuejs.org/guide/custom-blocks.html#example
import { LoaderContext } from 'webpack'
import { RawSourceMap } from 'source-map'

export default function (this: LoaderContext<any>, source: string | Buffer, map?: RawSourceMap) {
	const cb = this.async()
	if (cb) {
		cb(
			null,
			`export default function (Component) {
		Component.options.__docs = ${JSON.stringify(source)}
	  }`,
			map
		)
	}
}
