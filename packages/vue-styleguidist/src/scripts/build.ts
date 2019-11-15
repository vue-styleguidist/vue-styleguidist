import webpack from 'webpack'
import { ProcessedStyleGuidistConfigObject } from 'types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function build(
	config: ProcessedStyleGuidistConfigObject,
	handler: webpack.Compiler.Handler
) {
	return webpack(makeWebpackConfig(config, 'production'), (err, stats) => {
		handler(err, stats)
	})
}
