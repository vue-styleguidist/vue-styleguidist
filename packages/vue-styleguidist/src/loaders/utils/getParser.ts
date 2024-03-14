import { parse, ComponentDoc } from 'vue-docgen-api'
import { RuleSetUseItem } from 'webpack'
import * as pug from 'pug'
import { SanitizedStyleguidistConfig } from '../../types/StyleGuide'
import mergeWebpackConfig from '../../scripts/utils/mergeWebpackConfig'

export default function getParser(
	config: Pick<SanitizedStyleguidistConfig, 'webpackConfig'> &
		Partial<Pick<SanitizedStyleguidistConfig, 'jsxInComponents' | 'validExtends' | 'propsParser'>>
): (file: string) => Promise<ComponentDoc> {
	const { validExtends, propsParser } = config

	// resolve webpack config as functions or objects
	const webpackConfig = mergeWebpackConfig(
		{},
		config.webpackConfig,
		process.env.NODE_ENV || 'production'
	)

	let alias: { [key: string]: string | boolean | string[] } = {}
	let modules: string[] | undefined

	if (
		webpackConfig.resolve &&
		webpackConfig.resolve.alias &&
		!Array.isArray(webpackConfig.resolve.alias)
	) {
		alias = webpackConfig.resolve.alias
		modules = webpackConfig.resolve.modules
	}

	let pugOptions: pug.Options | undefined
	if (webpackConfig.module && webpackConfig.module.rules) {
		const { rules } = webpackConfig.module
		const pugLoader: any =
			rules.find(
				r => r && typeof r === 'object' && (r.loader === 'pug-loader' || r.use === 'pug-loader')
			) ||
			rules
				.reduce((acc: RuleSetUseItem[], r) => {
					if (r && typeof r === 'object' && Array.isArray(r.use)) {
						for (const t of r.use) {
							if (t && typeof t === 'object') {
								acc.push(t)
							}
						}
					}
					return acc
				}, [])
				.find(r => typeof r === 'object' && r.loader === 'pug-loader')

		if (pugLoader) {
			pugOptions = pugLoader.options as pug.Options
		} else {
			const pugLoaderUse = rules.find(
				r => r && typeof r === 'object' && r.use && (r.use as any).loader === 'pug-loader'
			) as { use: RuleSetUseItem | RuleSetUseItem[] }
			if (
				pugLoaderUse?.use &&
				typeof pugLoaderUse.use === 'object' &&
				!Array.isArray(pugLoaderUse.use)
			) {
				pugOptions = pugLoaderUse.use.options as pug.Options
			}
		}
	}

	const defaultParser = async (file: string) =>
		await parse(file, {
			alias,
			modules,
			jsx: config.jsxInComponents,
			validExtends,
			pugOptions
		})
	return propsParser || defaultParser
}
