# Configuration

By default, Vue styleguidist will look for `styleguide.config.js` file in your project’s root folder. You can change the location of the config file using `--config` [CLI](CLI.md) option.

<!-- To update run: npx markdown-toc --maxdepth 4 -i docs/Configuration.md -->

<!-- toc -->

- [`assetsDir`](#assetsdir)
- [`compilerConfig`](#compilerconfig)
- [`components`](#components)
- [`context`](#context)
- [`contextDependencies`](#contextdependencies)
- [`configureServer`](#configureserver)
- [`dangerouslyUpdateWebpackConfig`](#dangerouslyupdatewebpackconfig)
- [`defaultExample`](#defaultexample)
- [`getComponentPathLine`](#getcomponentpathline)
- [`editorConfig`](#editorconfig)
- [`getExampleFilename`](#getexamplefilename)
- [`exampleMode`](#examplemode)
- [`ignore`](#ignore)
- [`logger`](#logger)
- [`mountPointId`](#mountpointid)
- [`pagePerSection`](#pagepersection)
- [`printBuildInstructions`](#printbuildinstructions)
- [`printServerInstructions`](#printserverinstructions)
- [`previewDelay`](#previewdelay)
- [`propsParser`](#propsparser)
- [`require`](#require)
- [`renderRootJsx`](#renderrootjsx)
- [`ribbon`](#ribbon)
- [`sections`](#sections)
- [`serverHost`](#serverhost)
- [`serverPort`](#serverport)
- [`showSidebar`](#showsidebar)
- [`skipComponentsWithoutExample`](#skipcomponentswithoutexample)
- [`styleguideComponents`](#styleguidecomponents)
- [`styleguideDir`](#styleguidedir)
- [`styles`](#styles)
- [`template`](#template)
- [`theme`](#theme)
- [`title`](#title)
- [`sortProps`](#sortprops)
- [`updateDocs`](#updatedocs)
- [`updateExample`](#updateexample)
- [`usageMode`](#usagemode)
- [`verbose`](#verbose)
- [`version`](#version)
- [`webpackConfig`](#webpackconfig)

<!-- tocstop -->

#### `assetsDir`

Type: `String`, optional

Your application static assets folder, will be accessible as `/` in the style guide dev server.

#### `compilerConfig`

Type: `Object`, default: `{ objectAssign: 'Object.assign' }`

Styleguidist uses [Bublé](https://buble.surge.sh/guide/) to run ES6 code on the frontend. This config object will be added as the second argument for `buble.transform`.

#### `components`

Type: `String`, `Function` or `Array`, default: `src/components/**/*.vue`

- when `String`: a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) that matches all your component modules.
- when `Function`: a function that returns an array of module paths.
- when `Array`: an array of module paths.

All paths are relative to config folder.

See examples in the [Components section](Components.md#components).

#### `context`

Type: `Object`, optional

Modules that will be available for examples. You can use it for utility functions like Lodash or for data fixtures.

```javascript
module.exports = {
  context: {
    map: 'lodash/map',
    users: path.resolve(__dirname, 'fixtures/users')
  }
}
```

Then you can use them in any example:

```jsx
<Message>{map(users, 'name').join(', ')}</Message>
```

#### `contextDependencies`

Type: `String[]`, optional

Array of absolute paths that allow you to specify absolute paths of directories to watch for additions or removals of components.

By default Styleguidist uses common parent directory of your components.

```javascript
module.exports = {
  contextDependencies: [path.resolve(__dirname, 'lib/components')]
}
```

#### `configureServer`

Type: `Function`, optional

Function that allows you to add endpoints to the underlying Express server:

```javascript
module.exports = {
  configureServer(app) {
    // `app` is the instance of the express server running Styleguidist
    app.get('/custom-endpoint', (req, res) => {
      res.status(200).send({ response: 'Server invoked' })
    })
  }
}
```

Your components will be able to invoke the URL `http://localhost:6060/custom-endpoint` from their examples.

#### `dangerouslyUpdateWebpackConfig`

Type: `Function`, optional

> **Warning:** You may easily break Vue styleguidist using this options, try to use [webpackConfig](#webpackconfig) option instead.

Allows you to modify webpack config without any restrictions.

```javascript
module.exports = {
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    // WARNING: inspect Vue styleguidist Webpack config before modifying it, otherwise you may break Vue styleguidist
    console.log(webpackConfig)
    webpackConfig.externals = {
      jquery: 'jQuery'
    }
    return webpackConfig
  }
}
```

#### `defaultExample`

Type: `Boolean` or `String`, default: `false`

For components that do not have an example, a default one can be used. When set to `true`, the [DefaultExample.md](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/scripts/templates/DefaultExample.md) is used, or you can provide the path to your own example Markdown file.

When writing your own default example file, `__COMPONENT__` will be replaced by the actual component name at compile time.

#### `getComponentPathLine`

Type: `Function`, default: component file name

Function that returns a component path line (displayed under the component name).

For example, instead of `components/Button/Button.vue` you can print `import Button from 'components/Button';`:

```javascript
const path = require('path')
module.exports = {
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.vue')
    const dir = path.dirname(componentPath)
    return `import ${name} from '${dir}';`
  }
}
```

#### `editorConfig`

Type: `Object`, default: [scripts/schemas/config.js](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/scripts/schemas/config.js#L96)

Source code editor options, see [CodeMirror docs](https://codemirror.net/doc/manual.html#config) for all available options.

#### `getExampleFilename`

Type: `Function`, default: finds `Readme.md` or `ComponentName.md` in the component folder

Function that returns examples file path for a given component path.

For example, instead of `Readme.md` you can use `ComponentName.examples.md`:

```javascript
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.jsx?$/, '.examples.md')
  }
}
```

#### `exampleMode`

Type: `String`, default: `collapse`

Defines the initial state of the example code tab:

- `collapse`: collapses the tab by default.
- `hide`: hide the tab and it can´t be toggled in the UI.
- `expand`: expand the tab by default.

#### `ignore`

Type: `String[]`, default: `['**/__tests__/**']`

Array of [glob pattern](https://github.com/isaacs/node-glob#glob-primer) that should not be included in the style guide.

> **Note:** You should pass glob patterns, for example, use `**/components/Button.vue` instead of `components/Button.vue`.

#### `logger`

Type: `Object`, by default will use `console.*` in CLI or nothing in Node.js API

Custom logger functions:

```javascript
module.exports = {
  logger: {
    // One of: info, debug, warn
    // Suppress messages
    info: () => {},
    // Override display function
    warn: message => console.warn(`NOOOOOO: ${message}`)
  }
}
```

#### `mountPointId`

Type: `string`, defaults: `rsg-root`

The ID of a DOM element where Styleguidist mounts.

#### `pagePerSection`

Type: `Boolean`, default: `false`

Render one section or component per page.

If `true`, each section will be a single page.

The value may depends on a current environment:

```javascript
module.exports = {
  pagePerSection: process.env.NODE_ENV !== 'production'
}
```

To isolate section’s children as single pages (subroutes), add `sectionDepth` into each section with the number of subroutes (depth) to render as single pages.

For example:

```javascript
module.exports = {
  pagePerSection: true,
  sections: [
    {
      name: 'Documentation',
      sections: [
        {
          name: 'Files',
          sections: [
            {
              name: 'First File'
            },
            {
              name: 'Second File'
            }
          ]
        }
      ],
      // Will show "Documentation" and "Files" as single pages, filtering its children
      sectionDepth: 2
    },
    {
      name: 'Components',
      sections: [
        {
          name: 'Buttons',
          sections: [
            {
              name: 'WrapperButton'
            }
          ]
        }
      ]
      // Will show "Components" as single page, filtering its children
      sectionDepth: 1,
    },
    {
      name: 'Examples',
      sections: [
        {
          name: 'Case 1',
          sections: [
            {
              name: 'Buttons'
            }
          ]
        }
      ]
      // There is no subroutes, "Examples" will show all its children on a page
      sectionDepth: 0,
    }
  ]
}
```

#### `printBuildInstructions`

Type: `Function`, optional

Function that allows you to override the printing of build messages to console.log.

```javascript
module.exports = {
  printBuildInstructions(config) {
    console.log(
      `Style guide published to ${
        config.styleguideDir
      }. Something else interesting.`
    )
  }
}
```

#### `printServerInstructions`

Type: `Function`, optional

Function that allows you to override the printing of local dev server messages to console.log.

```javascript
module.exports = {
  serverHost: 'your-domain',
  printServerInstructions(config, { isHttps }) {
    console.log(`Local style guide: http://${config.serverHost}`)
  }
}
```

#### `previewDelay`

Type: `Number`, default: 500

Debounce time in milliseconds used before render the changes from the editor. While typing code the preview will not be updated.

#### `propsParser`

Type: `Function`, optional

Function that allows you to override the mechanism used to parse props from a source file. Default mechanism is using [vue-docgen-api](https://github.com/vue-styleguidist/vue-docgen-api) to parse props.

```javascript
module.exports = {
  propsParser(filePath, source) {
    return require('vue-docgen-api').parse(filePath)
  }
}
```

#### `require`

Type: `String[]`, optional

Modules that are required for your style guide. Useful for third-party styles or polyfills.

```javascript
module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'styleguide/styles.css')
  ]
}
```

> **Note:** This will add a separate webpack entry for each array item.

Don’t forget to add webpack loaders for each file you add here. For example, to require a CSS file you’ll need:

```javascript
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    }
  }
}
```

See [Configuring webpack](Webpack.md) for mode details.

#### `renderRootJsx`

Type: `String`, optional

Modifies the root component of the previews of the examples, receives as a parameter the preview component, must return a [component jsx](https://vuejs.org/v2/guide/render-function.html). It is useful when you want to create a container to all your examples by default, especially when you use a third library.

An example

```javascript
// config/styleguide.root.js
export default function (previewComponent) {
  render(createElement) {
    return createElement(previewComponent);
  },
}
```

```javascript
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

#### `ribbon`

Type: `Object`, optional

Shows 'Fork Me' ribbon in the top-right corner. If `ribbon` key is present, then it's required to add `url` property; `text` property is optional. If you want to change styling of the ribbon, please, refer to the [theme section](#theme).

```javascript
module.exports = {
  ribbon: {
    url: 'http://example.com/',
    text: 'Fork me on GitHub'
  }
}
```

#### `sections`

Type: `Array`, optional

Allows components to be grouped into sections with a title and overview content. Sections can also be content only, with no associated components (for example, a textual introduction). Sections can be nested.

See examples of [sections configuration](Components.md#sections).

#### `serverHost`

Type: `String`, default: `0.0.0.0`

Dev server host name.

#### `serverPort`

Type: `Number`, default: `6060`

Dev server port.

#### `showSidebar`

Type: `Boolean`, default: `true`

Toggle sidebar visibility. Sidebar will be hidden when opening components or examples in isolation mode even if this value is set to `true`. When set to `false`, sidebar will always be hidden.

#### `skipComponentsWithoutExample`

Type: `Boolean`, default: `false`

Ignore components that don’t have an example file (as determined by [getExampleFilename](#getexamplefilename)). These components won’t be accessible from other examples unless you [manually `require` them](Cookbook.md#how-to-hide-some-components-in-style-guide-but-make-them-available-in-examples).

#### `styleguideComponents`

Type: `Object`, optional

Override React components used to render the style guide.

```javascript
module.exports = {
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'styleguide/components/Wrapper'),
    StyleGuideRenderer: path.join(
      __dirname,
      'styleguide/components/StyleGuide'
    )
  }
}
```

See an example of [customized style guide](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/examples/customised).

If you want to wrap, rather than replace a component, make sure to import the default implementation using the full path to `vue-styleguidist`. See an example of [wrapping a Styleguidist component](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/examples/customised/styleguide/components/SectionsRenderer.js).

**Note**: these components are not guaranteed to be safe from breaking changes in vue-styleguidist updates.

#### `styleguideDir`

Type: `String`, default: `styleguide`

Folder for static HTML style guide generated with `styleguidist build` command.

#### `styles`

Type: `object`, optional

Customize styles of any Styleguidist’s component.

See example in the [cookbook](Cookbook.md#how-to-change-styles-of-a-style-guide).

#### `template`

Type: `Object` or `Function`, optional.

Change HTML for the style guide app.

An object with options to add a favicon, meta tags, inline JavaScript or CSS, etc. See [@vxna/mini-html-webpack-template docs](https://www.npmjs.com/package/@vxna/mini-html-webpack-template).

```javascript
module.exports = {
  template: {
    favicon: 'https://assets-cdn.github.com/favicon.ico'
  }
}
```

A function that returns an HTML string, see [mini-html-webpack-plugin docs](https://github.com/styleguidist/mini-html-webpack-plugin#custom-templates).

#### `theme`

Type: `object`, optional

Customize style guide UI fonts, colors, etc.

See example in the [cookbook](Cookbook.md#how-to-change-styles-of-a-style-guide).

#### `title`

Type: `String`, default: `<app name from package.json> Style Guide`

Style guide title.

#### `sortProps`

Type: `Function`, optional

Function that sorts component props. By default props are sorted such that required props come first, optional props come second. Props in both groups are sorted by their property names.

To disable sorting, use the identity function:

```javascript
module.exports = {
  sortProps: props => props
}
```

#### `updateDocs`

Type: `Function`, optional

Function that modifies props, methods, and metadata after parsing a source file. For example, load a component version from a JSON file:

```javascript
module.exports = {
  updateDocs(docs) {
    if (docs.doclets.version) {
      const versionFilePath = path.resolve(
        path.dirname(file),
        docs.doclets.version
      )
      const version = require(versionFilePath).version

      docs.doclets.version = version
      docs.tags.version[0].description = version
    }

    return docs
  }
}
```

#### `updateExample`

Type: `Function`, optional

Function that modifies code example (Markdown fenced code block). For example you can use it to load examples from files:

```javascript
module.exports = {
  updateExample(props, exampleFilePath) {
    const { settings, lang } = props
    if (typeof settings.file === 'string') {
      const filepath = path.resolve(exampleFilePath, settings.file)
      delete settings.file
      return {
        content: fs.readFileSync(filepath),
        settings,
        lang
      }
    }
    return props
  }
}
```

Use it like this in your Markdown files:

    ```js { "file": "./some/file.js" }
    ```

You can also use this function to dynamically update some of your fenced code blocks that you do not want to be interpreted as Vue components by using the [static modifier](Documenting.md#usage-examples-and-readme-files).

```javascript
module.exports = {
  updateExample(props) {
    const { settings, lang } = props
    if (lang === 'javascript' || lang === 'js' || lang === 'jsx') {
      settings.static = true
    }
    return props
  }
}
```

#### `usageMode`

Type: `String`, default: `collapse`

Defines the initial state of the props and methods tab:

- `collapse`: collapses the tab by default.
- `hide`: hide the tab and it can´t be toggled in the UI.
- `expand`: expand the tab by default.

#### `verbose`

Type: `Boolean`, default: `false`

Print debug information. Same as `--verbose` command line switch.

#### `version`

Type: `String`, optional

Style guide version, displayed under the title in the sidebar.

#### `webpackConfig`

Type: `Object` or `Function`, optional

Custom webpack config options: loaders, extensions, plugins, etc. required for your project.

Can be an object:

```javascript
module.exports = {
  webpackConfig: {
    module: {
      resolve: {
        extensions: ['.es6']
      },
      rules: [
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.scss$/,
          loaders: [
            'style-loader',
            'css-loader',
            'sass-loader?precision=10'
          ]
        }
      ]
    }
  }
}
```

Or a function:

```javascript
module.exports = {
  webpackConfig(env) {
    if (env === 'development') {
      return {
        // custom options
      }
    }
    return {}
  }
}
```

> **Warning:** This option disables config load from `webpack.config.js`, load your config [manually](Webpack.md#reusing-your-projects-webpack-config).

> **Note:** `entry`, `externals`, `output`, `watch`, and `stats` options will be ignored. For production builds, `devtool` will also be ignored.

> **Note:** `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` plugins will be ignored because Styleguidist already includes them or they may break Styleguidist.

> **Note:** Run style guide in verbose mode to see the actual webpack config used by vue-styleguidist: `npx vue-styleguidist server --verbose`.

See [Configuring webpack](Webpack.md) for examples.
