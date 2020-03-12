import webpack from 'webpack'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function build(
	config: SanitizedStyleguidistConfig,
	handler: webpack.Compiler.Handler
) {
	return webpack(makeWebpackConfig(config, 'production'), (err, stats) => {
		handler(err, stats)
	})
}
