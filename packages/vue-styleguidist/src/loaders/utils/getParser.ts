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

	let alias:
		| { [key: string]: string | false | string[] }
		| { alias: string | false | string[]; name: string; onlyModule?: boolean | undefined }[]
		| undefined
	let modules: string[] | undefined

	if (webpackConfig.resolve) {
		alias = webpackConfig.resolve.alias
		modules = webpackConfig.resolve.modules
	}

	let pugOptions: pug.Options | undefined
	if (webpackConfig.module && webpackConfig.module.rules) {
		const { rules } = webpackConfig.module
		const pugLoader: any =
			rules.find(
				r => typeof r === 'object' && (r.loader === 'pug-loader' || r.use === 'pug-loader')
			) ||
			rules
				.reduce((acc: RuleSetUseItem[], r) => {
					if (typeof r !== 'object') {
						return acc
					}
					if (Array.isArray(r.use)) {
						return acc.concat(r.use)
					}
					return acc
				}, [])
				.find(r => typeof r === 'object' && r.loader === 'pug-loader')

		if (pugLoader) {
			pugOptions = pugLoader.options as pug.Options
		} else {
			const pugLoaderUse = rules.find(
				r =>
					typeof r === 'object' &&
					typeof r.use === 'object' &&
					(r.use as any).loader === 'pug-loader'
			)
			if (
				typeof pugLoaderUse === 'object' &&
				pugLoaderUse.use &&
				typeof pugLoaderUse.use === 'object' &&
				!Array.isArray(pugLoaderUse.use)
			) {
				pugOptions = pugLoaderUse.use.options as pug.Options
			}
		}
	}

	const aliasNormalized = !alias
		? undefined
		: Array.isArray(alias)
		? convertAliasFormat(alias)
		: alias

	const defaultParser = async (file: string) =>
		await parse(file, {
			alias: aliasNormalized,
			modules,
			jsx: config.jsxInComponents,
			validExtends,
			pugOptions
		})
	return propsParser || defaultParser
}

function convertAliasFormat(
	input: {
		alias: string | false | string[]
		name: string
		onlyModule?: boolean | undefined
	}[]
) {
	return input.reduce((acc: { [key: string]: string | false | string[] }, cur) => {
		acc[cur.name] = cur.alias
		return acc
	}, {})
}
