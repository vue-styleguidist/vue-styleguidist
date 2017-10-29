# Configuration

By default, Vue styleguidist will look for `styleguide.config.js` file in your project’s root folder. You can change the location of the config file using `--config` [CLI](CLI.md) option.

<!-- To update run: npx markdown-toc --maxdepth 4 -i docs/Configuration.md -->

<!-- toc -->

- [`assetsDir`](#assetsdir)
- [`compilerConfig`](#compilerconfig)
- [`components`](#components)
- [`contextDependencies`](#contextdependencies)
- [`configureServer`](#configureserver)
- [`dangerouslyUpdateWebpackConfig`](#dangerouslyupdatewebpackconfig)
- [`defaultExample`](#defaultexample)
- [`getComponentPathLine`](#getcomponentpathline)
- [`getExampleFilename`](#getexamplefilename)
- [`highlightTheme`](#highlighttheme)
- [`mixins`](#mixins)
- [`ignore`](#ignore)
- [`logger`](#logger)
- [`previewDelay`](#previewdelay)
- [`propsParser`](#propsparser)
- [`require`](#require)
- [`sections`](#sections)
- [`serverHost`](#serverhost)
- [`serverPort`](#serverport)
- [`showCode`](#showcode)
- [`showUsage`](#showusage)
- [`showSidebar`](#showsidebar)
- [`skipComponentsWithoutExample`](#skipcomponentswithoutexample)
- [`styleguideComponents`](#styleguidecomponents)
- [`styleguideDir`](#styleguidedir)
- [`styles`](#styles)
- [`template`](#template)
- [`theme`](#theme)
- [`title`](#title)
- [`updateExample`](#updateexample)
- [`verbose`](#verbose)
- [`vuex`](#vuex)
- [`webpackConfig`](#webpackconfig)

<!-- tocstop -->

#### `assetsDir`

Type: `String`, optional

Your application static assets folder, will be accessible as `/` in the style guide dev server.

#### `compilerConfig`

Type: `Object`, default: `{ objectAssign: 'Object.assign' }`

Styleguidist uses [Bublé](https://buble.surge.sh/guide/) to run ES6 code on the frontend. This config object will be added as the second argument for `buble.transform`.

#### `components`

Type: `String` or `Function`, default: `src/components/**/*.vue`

- when `String`: a [glob pattern](https://github.com/isaacs/node-glob#glob-primer) that matches all your component modules.
- when `Function`: a function that returns an array of module paths.

All paths are relative to config folder.

See examples in the [Components section](Components.md#components).

#### `contextDependencies`

Type: `String[]`, optional

Array of absolute paths that allow you to specify absolute paths of directories to watch for additions or removals of components.

By default Styleguidist uses common parent directory of your components.

```javascript
module.exports = {
  contextDependencies: [
    path.resolve(__dirname, 'lib/components')
  ]
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
      res.status(200).send({ response: 'Server invoked' });
    });
  }
};
```

Your components will be able to invoke the URL `http://localhost:6060/custom-endpoint` from their examples.

#### `dangerouslyUpdateWebpackConfig`

Type: `Function`, optional

> **Warning:** You may easily break Styleguidist using this options, try to use [webpackConfig](#webpackconfig) option instead.

Allows you to modify webpack config without any restrictions.

```javascript
module.exports = {
  dangerouslyUpdateWebpackConfig(webpackConfig, env) {
    // WARNING: inspect Vue Styleguidist Webpack config before modifying it, otherwise you may break Styleguidist
    console.log(webpackConfig);
    webpackConfig.externals = {
        jquery: 'jQuery'
    };
    return webpackConfig;
  }
};
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
const path = require('path');
module.exports = {
  getComponentPathLine(componentPath) {
    const name = path.basename(componentPath, '.vue');
    const dir = path.dirname(componentPath);
    return `import ${name} from '${dir}';`;
  }
};
```

#### `getExampleFilename`

Type: `Function`, default: finds `Readme.md` or `ComponentName.md` in the component folder

Function that returns examples file path for a given component path.

For example, instead of `Readme.md` you can use `ComponentName.examples.md`:

```javascript
module.exports = {
  getExampleFilename(componentPath) {
    return componentPath.replace(/\.jsx?$/, '.examples.md');
  }
};
```

#### `highlightTheme`

Type: `String`, default: `base16-light`

[CodeMirror theme](http://codemirror.net/demo/theme.html) name to use for syntax highlighting in the editor.

#### `mixins`

Type: `Array`, default: `[]`

Set up the [mixins](https://vuejs.org/v2/guide/mixins.html#Global-Mixin) that will share all the components of examples in the style guide.
See example in the [cookbook](Cookbook.md#how-to-add-mixins-or-third-party-plugins-to-the-style-guide).

For example:

```javascript
module.exports = {
  mixins: [
    'src/mixins/logger.js',
    'src/mixins/global.js',
    // another mixin
    {
      created() {
        console.log('component created')
      }
    }
  ]
};
```

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
		warn: message => console.warn(`NOOOOOO: ${message}`),
	},
};
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
    return require('vue-docgen-api').parse(filePath);
  }
};
```

#### `require`

Type: `String[]`, optional

Modules that are required for your style guide. Useful for third-party styles or polyfills.

```javascript
module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'styleguide/styles.css'),
  ]
};
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
          use: [
            'style-loader',
            'css-loader'
          ]
        }
      ]
    }
  }
};
```

See [Configuring webpack](Webpack.md) for mode details.

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

#### `showCode`

Type: `Boolean`, default: `false`

Show or hide example code initially. It can be toggled in the UI by clicking the Code button after each example.

#### `showUsage`

Type: `Boolean`, default: `false`

Show or hide props and methods documentation initially. It can be toggled in the UI by clicking the Props & methods button after each component description.

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
		Logo: path.join(__dirname, 'styleguide/components/Logo'),
		StyleGuideRenderer: path.join(__dirname, 'styleguide/components/StyleGuide'),
	},
};
```

#### `styleguideDir`

Type: `String`, default: `styleguide`

Folder for static HTML style guide generated with `styleguidist build` command.

#### `styles`

Type: `object`, optional

Customize styles of any Styleguidist’s component.

See example in the [cookbook](Cookbook.md#how-to-change-styles-of-a-style-guide).

#### `template`

Type: `String`, default: [src/templates/index.html](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/scripts/templates/index.html)

HTML file to use as the template for the style guide. HTML webpack Plugin is used under the hood, see [their docs for details](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md).

#### `theme`

Type: `object`, optional

Customize style guide UI fonts, colors, etc.

See example in the [cookbook](Cookbook.md#how-to-change-styles-of-a-style-guide).

#### `title`

Type: `String`, default: `<app name from package.json> Style Guide`

Style guide title.

#### `updateExample`

Type: `Function`, optional

Function that modifies code example (Markdown fenced code block). For example you can use it to load examples from files:

```javascript
module.exports = {
  updateExample: function(props, exampleFilePath) {
    const { settings, lang } = props;
    if (typeof settings.file === 'string') {
      const filepath = path.resolve(exampleFilePath, settings.file);
      delete settings.file;
      return {
        content: fs.readFileSync(filepath),
        settings,
        lang,
      }
    }
    return props;
  }
};
```

Use it like this in your Markdown files:

    ```js { "file": "./some/file.js" }
    ```

You can also use this function to dynamically update some of your fenced code blocks that you do not want to be interpreted as Vue components by using the [static modifier](Documenting.md#usage-examples-and-readme-files).

```javascript
module.exports = {
  updateExample: function(props) {
    const { settings, lang } = props;
    if (lang === 'javascript' || lang === 'js' || lang === 'jsx') {
      settings.static = true;
    }
    return props;
  }
};
```

#### `verbose`

Type: `Boolean`, default: `false`

Print debug information. Same as `--verbose` command line switch.

#### `vuex`

Type: `String`, optional

For implementations with vuex, you can add the path where the store exports.

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
          loader: 'vue-loader',
        },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader', 'css-loader', 'sass-loader?precision=10']
        }
      ]
    }
  }
};
```

Or a function:

```javascript
module.exports = {
  webpackConfig(env) {
    if (env === 'development') {
        return {
            // custom options
        };
    }
    return {};
  }
};
```

> **Warning:** This option disables config load from `webpack.config.js`, load your config [manually](Webpack.md#reusing-your-projects-webpack-config).

> **Note:** `entry`, `externals`, `output`, `watch`, and `stats` options will be ignored. For production builds, `devtool` will also be ignored.

> **Note:** `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` plugins will be ignored because Styleguidist already includes them or they may break Styleguidist.

> **Note:** Run style guide in verbose mode to see the actual webpack config used by Styleguidist: `npm run styleguide -- --verbose`.

See [Configuring webpack](Webpack.md) for examples.
