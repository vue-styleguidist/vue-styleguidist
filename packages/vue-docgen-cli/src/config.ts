import {
	DocGenOptions,
	PropDescriptor,
	SlotDescriptor,
	MethodDescriptor,
	EventDescriptor,
	ComponentDoc
} from 'vue-docgen-api'
import { ContentAndDependencies, SubTemplateOptions } from './compileTemplates'

export { ContentAndDependencies, SubTemplateOptions }

export interface SafeDocgenCLIConfig {
	/**
	 * Should we add default examples
	 * @default true
	 */
	defaultExamples?: boolean
	/**
	 * Directory where the files will be built
	 * @default docs
	 */
	outDir: string
	/**
	 * File name where the current seciont is going to be output
	 */
	outFile?: string
	/**
	 * A glob to tell docgen where to document components
	 * @uitype string
	 * @description In the file you can have multiple here
	 */
	components?: string | string[]
	/**
	 * The root folder where components and subcomponents are going to be found
	 * @description The scaffolding of whatever is below this path will be kept in the `outDir`
	 */
	componentsRoot: string
	/**
	 * Allows you to pass [vue-docgen-api](https://vue-styleguidist.github.io/docs/Docgen.html) some config.
	 * Most notably, you can specify wether your components contain JSX code and the alias configured in your webpack.
	 */
	apiOptions?: DocGenOptions
	/**
	 * By default it will find the `Readme.md` sibling to the component files.
	 * Use this to point docgen to the files that contain documentation specific to a component.
	 * @param componentPath the path of the parsed components this doc is attached to
	 */
	getDocFileName(componentPath: string): string | false
	/**
	 * Function returning the absolute path of the documentation markdown files. If [outFile](#outfile) is used, this config will be ignored.
	 * @param file original file
	 * @param config config file
	 */
	getDestFile(file: string, config: SafeDocgenCLIConfig): string
	/**
	 * Should vue-docgen keep on watching your files for changes once generation is done?
	 */
	watch: boolean
	/**
	 * A set of function used to render the documentation
	 */
	templates: Templates
	/**
	 * if you want to force the current working directory to another absolute path
	 */
	cwd: string
	/**
	 * if you want to force the current working directory to another absolute path
	 */
	pages?: SafeDocgenCLIConfig[]
	/**
	 * for edit links
	 */
	docsRepo?: string
	/**
	 * for edit links
	 */
	docsBranch?: string
	/**
	 * for edit links
	 */
	docsFolder?: string
	/**
	 * Determines the urls behind each edit on github link
	 */
	getRepoEditUrl?: (relativePath: string) => string
	/**
	 *
	 */
	editLinkLabel: string
}

export interface DocgenCLIConfig extends Omit<SafeDocgenCLIConfig, 'templates' | 'pages'> {
	templates: Partial<Templates>
	pages?: DocgenCLIConfig
}

export interface Templates {
	props(props: PropDescriptor[], opt?: SubTemplateOptions): string
	slots(slots: SlotDescriptor[], opt?: SubTemplateOptions): string
	methods(methods: MethodDescriptor[], opt?: SubTemplateOptions): string
	events(events: EventDescriptor[], opt?: SubTemplateOptions): string
	component(
		usage: RenderedUsage,
		doc: ComponentDoc,
		config: SafeDocgenCLIConfig,
		componentRelativePath: string,
		requiresMd: ContentAndDependencies[],
		opt?: SubTemplateOptions
	): string
	defaultExample(doc: ComponentDoc): string
	functionalTag: string
}

export interface RenderedUsage {
	props: string
	slots: string
	methods: string
	events: string
	functionalTag: string
}
