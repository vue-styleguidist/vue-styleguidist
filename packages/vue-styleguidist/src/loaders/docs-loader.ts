// https://vue-loader.vuejs.org/guide/custom-blocks.html#example
import { loader } from 'webpack'
import { RawSourceMap } from 'source-map'

export default function(this: loader.LoaderContext, source: string | Buffer, map?: RawSourceMap) {
	this.callback(
		null,
		`export default function (Component) {
		Component.options.__docs = ${JSON.stringify(source)}
	  }`,
		map
	)
}
