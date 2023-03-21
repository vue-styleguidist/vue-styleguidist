# vue-docgen-cli

Generate documentation markdown files from VueJs components using the vue-docgen-api.

[![](https://img.shields.io/npm/v/vue-docgen-cli.svg)](https://www.npmjs.com/package/vue-docgen-cli) [![](https://img.shields.io/npm/dm/vue-docgen-cli.svg)](https://www.npmjs.com/package/vue-docgen-cli)

## Install

Install the module directly from npm:

```sh
yarn add -D vue-docgen-cli
```

## Usage

In a terminal window, navigate to the root of your project, then type the following command.

```sh
yarn vue-docgen src/components/**/*.vue docs/components
```

If your components are in the `src/components` folder, this will generate one `.md` file per component.

## Config

### Command Line Args

`vue-docgen` can take two nameless arguments. The `components` glob to locate components and the `destination` directory.

#### `-w` or `--watch`

Should vue-docgen watch for modifications of your components and update generated markdown files accordingly?

```sh
yarn vue-docgen -w
```

#### `-c` or `--configFile`

Specify the path of your configuration file. By default, `docgen` will look for `docgen.config.js` in the current folder.

```sh
yarn vue-docgen -c config/docgen.config.js
```

#### `-v` or `--verbose`

Should vue-docgen output more information?

```sh
yarn vue-docgen -v
```	

same as `--logLevel debug`

#### `--logLevel`

Specify the log level. Can be `error`, `warn`, `info`, `debug`, `trace`.

```sh
yarn vue-docgen --logLevel debug
```	

default is `error`	

### Config File

Create a `docgen.config.js` at the root of your project to avoid having to specify command-line arguments everytime.

All of the command-line arguments, except for the `--config`, can be replaced by lines in the `docgen.config.js` file.

In a config file you can even be more specific. Each of the following configurations is optional.

```js
const path = require('path')

module.exports = {
  componentsRoot: 'src/components', // the folder where CLI will start searching for components.
  components: '**/[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
  ignore: '*.test.ts', // optional glob to ignore files
  outDir: 'docs', // folder to save components docs in (relative to the current working directry)
  apiOptions: {
    ...require('./webpack.config').resolve, // inform vue-docgen-api of your webpack aliases
    jsx: true // tell vue-docgen-api that your components are using JSX to avoid conflicts with TypeScript <type> syntax
  },
  getDocFileName: (componentPath: string) =>
    componentPath.replace(/\.vue$/, '.md'), // specify the name of the input md file
  getDestFile: (file: string, config: DocgenCLIConfig) =>
    path.join(config.outDir, file).replace(/\.vue$/, '.doc.md'), // specify the name of the output md file
  templates: {
    // global component template wrapping all others see #templates
    component: require('templates/component'),
    events: require('templates/events'),
    methods: require('templates/methods'),
    props: require('templates/props'),
    slots: require('templates/slots'),
    // static template to display as a tag if component is functional
    functionalTag: '**functional**'
  },
  docsRepo: 'profile/repo',
  docsBranch: 'master',
  docsFolder: '',
  editLinkLabel: 'Edit on github'
}
```

#### components

> type: `string | string[]` , default: `"src/components/**/[a-zA-Z]*.{vue,js,jsx,ts,tsx}"`

Glob string used to get all the components to parse and document.

#### outDir

> type: `string`, default: `"docs"`

The root directory for the generation of the markdown files

#### outFile

> type: `string`, optional

If you specify this, all documentation will be generated in one single page. The path of this file is relative to the outDir.

The following configuration will generate one single file: `myDocs/components.md`

```js
module.exports = {
  outDir: 'myDocs',
  outFile: 'components.md'
}
```

#### componentsRoot

> type: `string`, default: `path.dirname(configFilePath)`

The folder where CLI will start searching for components. Since the folder structure will be kept from source to destination, it avoids having uselessly deep scaffoldings.

```
   src
    └───components
        ├───Button.vue
        ├───CounterButton.vue
        ├───Functional.vue
        └───Input.vue
```

If you simply use `src/components/**/[A-Z]*.vue` as source glob and `docs` as outDir, you will get this.

```
   src
    └───components
        ├───Button.vue
        ├───CounterButton.vue
        ├───Functional.vue
        └───Input.vue
   docs
    └───src
        └───components
            ├───Button.vue
            ├───CounterButton.vue
            ├───Functional.vue
            └───Input.vue
```

Specifying `componentsRoot: 'src/components'` and using `**/[A-Z].vue` will skip the two useless levels of hierarchy.

#### apiOptions

> type: `DocGenOptions`, optional

Allows you to give [vue-docgen-api](https://vue-styleguidist.github.io/docs/Docgen.html) some config. Most notably, you can specify wether your components contain JSX code and the alias configured in your webpack.

#### getDocFileName

> type: `(componentPath: string) => string`, default: `(componentPath) => path.resolve(path.dirname(componentPath), 'Readme.md')`

By default it will find the `Readme.md` sibling to the component files. Use this to point docgen to the files that contain documentation specific to a component.

#### getDestFile

> type: `(file: string, config: DocgenCLIConfig) => string`, default: `(file, config) => path.resolve(config.outDir, file).replace(/\.\w+\$/, '.md')`

Function returning the absolute path of the documentation markdown files. If [outFile](#outfile) is used, this config will be ignored.

#### watch

> type: `boolean`, default: `false`

Should vue-docgen keep on watching your files for changes once the first files are generated?

#### templates

> type: `Templates`, optional

An object specifying the functions to be used to render the components.

For example:

file: `component.ts`

```ts
export default function component(
  renderedUsage: RenderedUsage, // props, events, methods and slots documentation rendered
  doc: ComponentDoc, // the object returned by vue-docgen-api
  config: DocgenCLIConfig, // the local config, useful to know the context
  fileName: string, // the name of the current file in the doc (to explain how to import it)
  requiresMd: ContentAndDependencies[], // a list of all the documentation files
  // attached to the component documented. It includes documentation of subcomponents
  { isSubComponent, hasSubComponents }: SubTemplateOptions // are we documenting
): // a sub-component or does the current component have subcomponents
string {
  const { displayName, description, docsBlocks } = doc
  return `
  # ${displayName}

  ${description ? '> ' + description : ''}

  ${renderedUsage.props}
  ${renderedUsage.methods}
  ${renderedUsage.events}
  ${renderedUsage.slots}
  ${docsBlocks ? '---\n' + docsBlocks.join('\n---\n') : ''}
  `
}
```

And the partial for slots

```ts
import { SlotDescriptor } from 'vue-docgen-api'
import { cleanReturn } from './utils'

export default (
  slots: {
    [slotName: string]: SlotDescriptor
  },
  opt?: {
    isSubComponent: boolean
    hasSubComponents: boolean
  }
): string => {
  const slotNames = Object.keys(slots)
  if (!slotNames.length) {
    return '' // if no slots avoid creating the section
  }
  return `
## Slots

  | Name          | Description  | Bindings |
  | ------------- | ------------ | -------- |
${slotNames
  .map(slotName => {
    const { description, bindings } = slots[slotName]
    const readableBindings = // serialize bindings to display them ina readable manner
      bindings && Object.keys(bindings).length
        ? JSON.stringify(bindings, null, 2)
        : ''
    return cleanReturn(
      `| ${slotName} | ${description} | ${readableBindings} |`
    ) // remplace returns by <br> to allow them in a table cell
  })
  .join('\n')}
  `
}
```

#### pages

> type: `Array<DocgenCLIConfig>`, optional

Allows to group components into pages. Each page will inherit its parent properties.

```js
const path = require('path')

module.exports = {
  componentsRoot: 'src/components', // the folder where CLI will start searching for components.
  outDir: 'docs',
  pages: [
    {
      components: 'atoms/**/[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
      outFile: 'atoms.md' // saved as `docs/atoms.md`
    },
    {
      components: 'molecules/**/[A-Z]*.vue', // the glob to define what files should be documented as components (relative to componentRoot)
      outFile: 'molecules.md' // saved as `docs/molecules.md`
    }
  ]
}
```

#### defaultExamples

> type: `boolean`, default: `false`

Generate an example for components that have neither `<docs>` block nor a markdown file to provide examples of usage.

#### cwd

> type: `string`, optional

Force the Current Working Directory. Useful in monorepos.

#### getRepoEditUrl

> type: `(relativePath: string) => string`, default: `` p => `https://github.com/${config.docsRepo}/edit/${branch}/${dir}/${p}` ``

Gets the link to the documentation edition from

#### docsRepo

> type: `string`, optional

If you specify the docsRepo, and you do not want to specify `getRepoEditUrl` you will get links to edit the docs near each readme files.

#### docsBranch

> type: `string`, default: `master`

The branch you want the edit links to send you to

#### docsFolder

> type: `string`, default: ``

If the root folder is not at the root of your repo, use this parameter

#### editLinkLabel

> type: `string`, default: `Edit on github`

The label we can read on edit button

## Change log

The change log can be found on the [Changelog Page](./CHANGELOG.md).

## Authors and license

[Bart Ledoux](https://github.com/elevatebart)

MIT License.
