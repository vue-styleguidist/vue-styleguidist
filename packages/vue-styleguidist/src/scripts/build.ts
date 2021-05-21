import webpack from 'webpack'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack-config'

export default function build(
	config: SanitizedStyleguidistConfig,
	handler: Parameters<typeof webpack>[1]
) {
	return webpack(makeWebpackConfig(config, 'production'), (err, stats) => {
		handler && handler(err, stats)
	})
}
