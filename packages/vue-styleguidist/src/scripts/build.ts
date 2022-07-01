import webpack, { Stats } from 'webpack'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'
import makeWebpackConfig from './make-webpack5-config'

export default function build(
	config: SanitizedStyleguidistConfig,
	handler: (err: Error | undefined, stats: Stats) => void
) {
	return webpack(makeWebpackConfig(config, 'production'), handler)
}
