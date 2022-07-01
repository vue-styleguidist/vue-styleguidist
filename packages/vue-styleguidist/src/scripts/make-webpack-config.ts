import webpack from 'webpack'
import config4 from './make-webpack4-config'
import config5 from './make-webpack5-config'
import { SanitizedStyleguidistConfig } from '../types/StyleGuide'

export default function makeWebpackConfig(
	config: SanitizedStyleguidistConfig,
	env: 'development' | 'production' | 'none'
): webpack.Configuration {
	if (webpack.version.startsWith('5.')) {
		return config5(config, env)
	} else {
		return config4(config, env)
	}
}
