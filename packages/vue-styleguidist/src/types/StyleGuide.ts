
/**
* /!\ WARNING /!\
* Do not edit manually.
* This file is the compilation of 
* Template: packages/vue-styleguidist/templates/StyleGuide.ts.ejs
* Config Data: packages/vue-styleguidist/src/scripts/schemas/config.ts
*/
import React from 'react'
import WebpackDevServer from 'webpack-dev-server'
import { ComponentDoc, PropDescriptor } from 'vue-docgen-api'
import { compile } from 'vue-inbrowser-compiler'
import { Styles } from 'jss';
import { Configuration, LoaderContext } from 'webpack'
import * as Rsg from 'react-styleguidist'
import { RecursivePartial } from 'react-styleguidist/lib/typings/RecursivePartial'
import { ProcessedSection } from './Section'
import { LoaderComponentProps } from './Component'

type TransformOptions = Required<Parameters<typeof compile>>[1]

export interface StyleguidistContext extends LoaderContext<{
	file:string,
	displayName:string,
	noExample: boolean,
	shouldShowDefaultExample:boolean,
	customLangs: string[],
}> {
    _styleguidist: SanitizedStyleguidistConfig
}

export interface BaseStyleguidistConfig
    extends Omit<
        Rsg.SanitizedStyleguidistConfig,
        'sections' | 'propsParser' | 'sortProps' | 'updateDocs'
    > {
    handlers: any;
    moduleAliases: any;
    resolver: any;
    /**
     * Your application static assets folder, will be accessible as / in the style guide dev server. 
     */
    assetsDir: string;
    /**
     * Should the styleguide try code splitting for better performance? NOte that you will need the proper transform in your babel config 
     * @default true 
     */
    codeSplit: boolean;
    /**
     * Compiler to use for compiling examples in the browser 
     */
    compilerPackage: string;
    compilerConfig: TransformOptions;
    /**
     * Where to find the components. Takes in a String or an Array of glob paths. Comma separated. 
     */
    components: (() => string[]) | string | string[];
    configDir: string;
    context: Record<string, any>;
    contextDependencies: string[];
    configureServer: (server: WebpackDevServer, env: string) => string;
    /**
     * Add a button on the top right of the code sections to copy to clipboard the current contents of the editor 
     * @default false 
     */
    copyCodeButton: boolean;
    /**
     * Allows you to modify webpack config without any restrictions 
     */
    dangerouslyUpdateWebpackConfig: (server: Configuration, env: string) => Configuration;
    /**
     * Display each component with a default example, regardless of if there's a README or <docs/> block written. 
     * @default false 
     */
    defaultExample: string;
    /**
     * In the generated docs, this adda a column to the props table giving in which file it is defined. Useful when extending components or mixing mixins 
     * @default false 
     */
    displayOrigins: boolean;
    editorConfig: {
		theme: string
	};
    /**
     * Allow to declare global directives and plugins in vue 3 examples 
     */
    enhancePreviewApp: string;
    /**
     * Defines the initial state of the props and methods tab 
     * @default "collapse" 
     */
    exampleMode: Rsg.ExpandMode;
    getComponentPathLine: (componentPath: string) => string;
    getExampleFilename: (componentPath: string) => string;
    /**
     * @deprecated Use the theme property in the editorConfig option instead 
     * @default "base16-light" 
     */
    highlightTheme: string;
    /**
     * What components to ignore. Can be an Array or String. Comma separated. 
     */
    ignore: string[];
    /**
     * By default, the PrismJs editor is themed in the theme files. If you want to use a theme defined in CSS, set this to false and require the CSS file in the `require` config. 
     * @default true 
     */
    jssThemedEditor: boolean;
    /**
     * Do documented components contain JSX syntax? Set this to `false` to restore compatibility with this TypeScript cast syntax: `<any>variable` instead of `variable as any`. 
     * @default true 
     */
    jsxInComponents: boolean;
    /**
     * Allow exmaples to contain JSX syntax. Use proper JSX Vue component format in examples. 
     * @default false 
     */
    jsxInExamples: boolean;
    /**
     * Register components on their examples only instead of globally Vue.components() 
     * @default false 
     */
    locallyRegisterComponents: boolean;
    /**
     * @deprecated Use pagePerSection option instead 
     * @default false 
     */
    navigation: boolean;
    /**
     * @deprecated Use renderRootJsx option instead 
     */
    mixins: string[];
    logger: {
		info(message: string): void
		warn(message: string): void
		debug(message: string): void
	};
    /**
     * If this option is set to false, the styelguidist will not minimize the js at build. 
     * @default true 
     */
    minimize: boolean;
    /**
     * The ID of a DOM element where Styleguidist mounts. 
     * @default "rsg-root" 
     */
    mountPointId: string;
    /**
     * Render one section or component per page. If true, each section will be a single page. 
     * @default false 
     */
    pagePerSection: boolean;
    /**
     * @default 500 
     */
    previewDelay: number;
    printBuildInstructions: any;
    printServerInstructions: any;
    /**
     * Display a progress bar while building 
     * @default true 
     */
    progressBar: boolean;
    propsParser: (file: string) => Promise<ComponentDoc>;
    require: string[];
    renderRootJsx: string;
    /**
     * Shows 'Fork Me' ribbon in the top-right corner. If ribbon key is present, then it's required to add url property; text property is optional. If you want to change styling of the ribbon, please, refer to the theme section in the documentation. 
     */
    ribbon: {
		url: string,
		text: string
	};
    /**
     * Dev server host name 
     * @default "0.0.0.0" 
     */
    serverHost: string;
    /**
     * Dev server port 
     * @default 6060 
     */
    serverPort: number;
    /**
     * @deprecated Use exampleMode option instead 
     * @default false 
     */
    showCode: boolean;
    /**
     * @deprecated Use usageMode option instead 
     * @default false 
     */
    showUsage: boolean;
    /**
     * Toggle sidebar visibility. Sidebar will be hidden when opening components or examples in isolation mode even if this value is set to true. When set to false, sidebar will always be hidden. 
     * @default true 
     */
    showSidebar: boolean;
    /**
     * Avoid loading CodeMirror and reduce bundle size significantly, use prism.js for code highlighting. Warning: editor options will not be mapped over. 
     * @default true 
     */
    simpleEditor: boolean;
    /**
     * Ignore components that don’t have an example file (as determined by getExampleFilename). These components won’t be accessible from other examples unless you manually require them. 
     * @default false 
     */
    skipComponentsWithoutExample: boolean;
    sortProps: (props: PropDescriptor[]) => PropDescriptor[];
    styleguideComponents: { [name: string]: string };
    /**
     * Folder for static HTML style guide generated with `styleguidist build` command. 
     * @default "styleguide" 
     */
    styleguideDir: string;
    /**
     * configures the prefix of the server and built urls. 
     * @default "" 
     */
    styleguidePublicPath: string;
    styles: Styles | string | ((theme: any) => Styles);
    template: any;
    theme: { [name: string]: any } | string;
    /**
     * Style guide title 
     */
    title: string;
    updateDocs: (doc: LoaderComponentProps, file: string) => LoaderComponentProps;
    updateExample: (
		props: Pick<Rsg.CodeExample, 'content' | 'lang' | 'settings'>,
		ressourcePath: string
	) => Rsg.CodeExample;
    updateWebpackConfig: any;
    /**
     * Defines the initial state of the props and methods tab 
     * @default "collapse" 
     */
    usageMode: Rsg.ExpandMode;
    /**
     * If set to collapse, the sidebar sections are collapsed by default. Handy when dealing with big Components bases 
     * @default "expand" 
     */
    tocMode: Rsg.ExpandMode;
    /**
     * Should the passed filepath be parsed by docgen if mentionned extends 
     */
    validExtends: (filePath: string) => boolean;
    /**
     * Print debug information. Same as --verbose command line switch. 
     * @default false 
     */
    verbose: boolean;
    /**
     * The version # of the Styleguide 
     */
    version: string;
    /**
     * @deprecated Use renderRootJsx option instead 
     */
    vuex: any;
    webpackConfig: Configuration;
}

export interface SanitizedStyleguidistConfig extends BaseStyleguidistConfig {
	sections: Rsg.ConfigSection[];
}

/**
 * definition of the config object where everything is optional
 * note that teh default example can be both a string and a boolean but ends
 * up only being a string after sanitizing
 */
export interface StyleguidistConfig
	extends RecursivePartial<Omit<SanitizedStyleguidistConfig, 'defaultExample'>> {
	defaultExample?: string | boolean;
}

export interface StyleGuideObject {
    sections: ProcessedSection[]
    config: StyleguidistConfig
    renderRootJsx: React.ReactNode
    enhancePreviewApp: (app: any) => void
    welcomeScreen: any
    patterns: string[]
}
