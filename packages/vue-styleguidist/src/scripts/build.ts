import webpackNormal from 'webpack'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function build(
	config: SanitizedStyleguidistConfig,
	handler: webpackNormal.Compiler.Handler
) {
	const webpack: typeof webpackNormal = process.env.VSG_WEBPACK_PATH
		? require(process.env.VSG_WEBPACK_PATH)
		: webpackNormal

	return webpack(makeWebpackConfig(config, 'production'), (err, stats) => {
		handler(err, stats)
	})
}
