import { parse, ComponentDoc } from 'vue-docgen-api'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'
import mergeWebpackConfig from '../../scripts/utils/mergeWebpackConfig'

export default function getParser(
	config: SanitizedStyleguidistConfig
): (file: string) => Promise<ComponentDoc> {
	// resolve webpack config as functions or objects
	const webpackConfig = mergeWebpackConfig(
		{},
		config.webpackConfig,
		process.env.NODE_ENV || 'production'
	)

	let alias: { [key: string]: string } | undefined
	let modules: string[] | undefined
	if (webpackConfig.resolve) {
		alias = webpackConfig.resolve.alias
		modules = webpackConfig.resolve.modules
	}
	const defaultParser = async (file: string) =>
		await parse(file, {
			alias,
			modules,
			jsx: config.jsxInComponents,
			validExtends: config.validExtends
		})
	return config.propsParser || defaultParser
}
