/* eslint-disable import/no-duplicates */

// loaders

declare module 'react-styleguidist/lib/loaders/utils/getNameFromFilePath' {
	const getNameFromFilePath: (input: string) => string
	export default getNameFromFilePath
}

declare module 'react-styleguidist/lib/loaders/utils/requireIt' {
	import * as b from '@babel/types'

	const requireIt: (input: string) => { require: string; toAST: () => b.Node } | any
	export default requireIt
}

declare module 'react-styleguidist/lib/loaders/utils/slugger' {
	const slugger: {
		slug: (input: string) => string
		reset(): void
	}
	export default slugger
}

declare module 'react-styleguidist/lib/loaders/utils/getComponentFiles' {
	const getComponentFiles: (
		components: (() => string | string[]) | string | string[] | undefined,
		configDir: string,
		ignore: string[]
	) => string[]
	export default getComponentFiles
}

declare module 'react-styleguidist/lib/loaders/utils/highlightCodeInMarkdown' {
	const highlightCodeInMarkdown: (markdown: string) => string
	export default highlightCodeInMarkdown
}

declare module 'react-styleguidist/lib/loaders/utils/removeDoclets' {
	const removeDoclets: (description: string) => string
	export default removeDoclets
}

declare module 'react-styleguidist/lib/loaders/utils/sortProps' {
	import { PropDescriptor } from 'vue-docgen-api'

	function sortProps(props: PropDescriptor[]): PropDescriptor[]
	export default sortProps
}

declare module 'react-styleguidist/lib/loaders/utils/getAllContentPages' {
	import { ProcessedSection as SectionPages } from 'types/Section'

	function getAllContentPages(sections: SectionPages[]): string[]
	export default getAllContentPages
}
declare module 'react-styleguidist/lib/loaders/utils/getComponentFilesFromSections' {
	import { Section as SectionFiles } from 'types/Section'

	function getComponentFilesFromSections(
		sections: SectionFiles[],
		componentDir?: string,
		ignore?: string | string[]
	): string[]
	export default getComponentFilesFromSections
}
declare module 'react-styleguidist/lib/loaders/utils/getComponentPatternsFromSections' {
	import { Section as SectionPattern } from 'types/Section'

	function getComponentPatternsFromSections(sections: SectionPattern[]): string[]
	export default getComponentPatternsFromSections
}
declare module 'react-styleguidist/lib/loaders/utils/filterComponentsWithExample' {
	import { ProcessedSection as SectionFilter } from 'types/Section'

	function filterComponentsWithExample(sections: SectionFilter[]): SectionFilter[]
	export default filterComponentsWithExample
}

declare module 'react-styleguidist/lib/loaders/utils/chunkify' {
	import { ExampleLoader } from 'types/Example'

	function chunkify(
		markdown: string | false,
		updateExample: (p: ExampleLoader, resourcePath: string) => ExampleLoader,
		playgroundLangs: string[]
	): ExampleLoader[]
	export default chunkify
}
declare module 'react-styleguidist/lib/loaders/utils/expandDefaultComponent' {
	function expandDefaultComponent(source: string, cleanDisplayName?: string): string
	export default expandDefaultComponent
}
declare module 'react-styleguidist/lib/loaders/utils/getImports' {
	const getImports: (code: string) => string[]
	export default getImports
}

// script

declare module 'react-styleguidist/lib/scripts/make-webpack-config' {
	import { Configuration } from 'webpack'
	import { StyleguidistConfig } from 'types/StyleGuide'

	const makeWebpackConfig: (config: StyleguidistConfig, env: string) => Configuration
	export default makeWebpackConfig
}

declare module 'react-styleguidist/lib/scripts/utils/StyleguidistOptionsPlugin' {
	import { Plugin } from 'webpack'

	class StyleguidistOptionsPlugin extends Plugin {
		constructor(options: any)
	}
	export default StyleguidistOptionsPlugin
}

declare module 'react-styleguidist/lib/scripts/utils/findFileCaseInsensitive' {
	const findFileCaseInsensitive: {
		(filePath: string): boolean
		clearCache(): void
	}
	export = findFileCaseInsensitive
}

declare module 'react-styleguidist/lib/scripts/utils/getUserPackageJson' {
	function getUserPackageJson(): { name: string }
	export default getUserPackageJson
}

declare module 'react-styleguidist/lib/scripts/utils/error' {
	class StyleguidistError extends Error {
		constructor(message: string, extra?: string)
		anchor: string
		extra: string
	}
	export default StyleguidistError
}

declare module 'react-styleguidist/lib/scripts/utils/sanitizeConfig' {
	import { StyleguidistConfig as StyleGuidistConfigObjectSanitizeConfig } from 'types/StyleGuide'

	function sanitizeConfig(
		config: StyleGuidistConfigObjectSanitizeConfig,
		schema: any,
		configDir: string
	): StyleGuidistConfigObjectSanitizeConfig
	export default sanitizeConfig
}

declare module 'react-styleguidist/lib/scripts/logger' {
	function setupLogger(
		methods?: {
			info?(message: string): void
			warn?(message: string): void
			debug?(message: string): void
		},
		verbose?: boolean,
		defaults?: {
			info?(message: string): void
			warn?(message: string): void
			debug?(message: string): void
		}
	): void
	export default setupLogger
}

// client

declare module 'react-styleguidist/lib/client/utils/getRouteData' {
	// in order to avoid duplicate declaration errors,
	// we alias each import of sections
	import { ProcessedSection as RouteSection } from 'types/Section'
	import { DISPLAY_MODE as Route_DISPLAY_MODE } from 'types/enums'

	const getRouteData: (
		allSections: RouteSection[],
		hash: string,
		pagePerSection?: boolean
	) => {
		sections: RouteSection[]
		displayMode: Route_DISPLAY_MODE
	}
	export default getRouteData
}

declare module 'react-styleguidist/lib/client/utils/getPageTitle' {
	import { ProcessedSection as TitleSection } from 'types/Section'
	import { DISPLAY_MODE as Title_DISPLAY_MODE } from 'types/enums'

	const getPageTitle: (
		sections: TitleSection[],
		title?: string,
		displayMode?: Title_DISPLAY_MODE
	) => string
	export default getPageTitle
}

declare module 'react-styleguidist/lib/client/utils/handleHash' {
	export const getParameterByName: (hash: string, paramName: string) => string
	export const hasInHash: (hash: string, separator: string) => boolean
}

// components

declare module 'rsg-components/StyleGuide' {
	import { FunctionComponent } from 'react'
	import { StyleguidistConfig as StyleGuideStyleGuidistConfigObject } from 'types/StyleGuide'
	import { ProcessedSection as StyleGuideSection } from 'types/Section'
	import { DISPLAY_MODE as StyleGuide_DISPLAY_MODE } from 'types/enums'

	const StyleGuide: FunctionComponent<{
		codeRevision: number
		config: StyleGuideStyleGuidistConfigObject
		slots: any
		welcomeScreen: any
		patterns: any[]
		sections: StyleGuideSection[]
		allSections: StyleGuideSection[]
		displayMode: StyleGuide_DISPLAY_MODE
		pagePerSection: any
	}>
	export default StyleGuide
}

declare module 'rsg-components/slots' {
	import { StyleguidistConfig as slotsStyleGuidistConfigObject } from 'types/StyleGuide'

	const slots: (config?: slotsStyleGuidistConfigObject) => any
	export default slots
}
