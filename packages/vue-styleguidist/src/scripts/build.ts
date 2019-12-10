import webpack from 'webpack'
import { StyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function build(config: StyleguidistConfig, handler: webpack.Compiler.Handler) {
	return webpack(makeWebpackConfig(config, 'production'), (err, stats) => {
		handler(err, stats)
	})
}
