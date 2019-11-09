import WebpackDevServer from 'webpack-dev-server'
import { ComponentDoc, PropDescriptor } from 'vue-docgen-api'
import { Configuration, loader } from 'webpack'
import { ProcessedSection, Section } from './Section'
import { EXPAND_MODE } from './enums'
import { Example } from './Example'
import { ComponentProps } from './Component'

export interface StyleguidistContext extends loader.LoaderContext {
	_styleguidist: ProcessedStyleGuidistConfigObject
}

export interface StyleGuidistConfigObject {
	compilerConfig?: any
	context?: string[]
	jsxInExamples?: boolean
	updateExample?(p: Example, resourcePath: string): Example
	sections?: Section[]
	renderRootJsx?: string
	skipComponentsWithoutExample?: boolean
	updateDocs?(doc: ComponentProps, file: string): ComponentProps
	defaultExample?: string
	getExampleFilename?(file: string): string
	getComponentPathLine?(file: string): string
	sortProps?(props: PropDescriptor[]): PropDescriptor[]
	propsParser?(file: string): Promise<ComponentDoc>
	jsxInComponents?: boolean
	contextDependencies?: string[]
	printBuildInstructions?(config: ProcessedStyleGuidistConfigObject): void
	printServerInstructions?(
		config: ProcessedStyleGuidistConfigObject,
		options: { isHttps: boolean }
	): void
	showUsage?: boolean
	components?: string
	highlightTheme?: { theme: string }
	title?: string
	pagePerSection?: boolean
	locallyRegisterComponents?: boolean
	ignore?: string | string[]
	configDir?: string
	usageMode?: EXPAND_MODE
	exampleMode?: EXPAND_MODE
	serverPort?: number
	serverHost?: string
	assetsDir?: string
	styleguideComponents?: { [name: string]: string }
	simpleEditor?: boolean
	copyCodeButton?: boolean
	codeSplit?: boolean
	styleguidePublicPath?: string
	styleguideDir?: string
	showCode?: boolean
	verbose?: boolean
	minimize?: boolean
	require?: string[]
	webpackConfig?: Configuration
	editorConfig?: {
		theme: string
	}
	mountPointId?: string
	template?: string
	styleguidistDir?: string
	configureServer?: (server: WebpackDevServer, env: string) => string
	dangerouslyUpdateWebpackConfig?(
		config: Configuration,
		env: 'development' | 'production' | 'none'
	): Configuration
	logger?: {
		info(message: string): void
		warn(message: string): void
		debug(message: string): void
	}
}

export interface ProcessedStyleGuidistConfigObject extends StyleGuidistConfigObject {
	progressBar: boolean
	getExampleFilename(file: string): string
	getComponentPathLine(file: string): string
	configDir: string
	usageMode: EXPAND_MODE
	exampleMode: EXPAND_MODE
	serverPort: number
	serverHost: string
	assetsDir: string
	require: string[]
	webpackConfig: Configuration
	editorConfig: {
		theme: string
	}
	mountPointId: string
	template: string
}

export interface StyleGuideObject {
	sections: ProcessedSection[]
	config: ProcessedStyleGuidistConfigObject
	renderRootJsx: any
	welcomeScreen: any
	patterns: any
}
