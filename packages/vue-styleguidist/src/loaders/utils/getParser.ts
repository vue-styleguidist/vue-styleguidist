import { parse, ComponentDoc } from 'vue-docgen-api'
import * as pug from 'pug'
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

	let pugOptions: pug.Options | undefined
	if (webpackConfig.rules) {
		const pugLoader =
			webpackConfig.rules.find((r: any) => r.loader === 'pug-loader') ||
			webpackConfig.rules.find((r: any) => r.use.loader === 'pug-loader').use ||
			webpackConfig.rules
				.filter((r: any) => Array.isArray(r.use))
				.find((r: any) => r.loader === 'pug-loader')
		if (pugLoader) {
			pugOptions = pugLoader.options
		}
	}

	const defaultParser = async (file: string) =>
		await parse(file, {
			alias,
			modules,
			jsx: config.jsxInComponents,
			validExtends: config.validExtends,
			pugOptions
		})
	return config.propsParser || defaultParser
}
