# Configuring webpack

Vue styleguidist uses [webpack](https://webpack.js.org/) under the hood and it needs to know how to load your project’s files.

_Webpack is required to run Vue styleguidist but your project doesn’t have to use it._

> **Note:** See [cookbook](Cookbook.md) for more examples.

<!-- To update run: npx markdown-toc --maxdepth 2 -i docs/Webpack.md -->

<!-- toc -->

- [Reusing your project’s webpack config](#reusing-your-projects-webpack-config)
- [Custom webpack config](#custom-webpack-config)
- [When nothing else works](#when-nothing-else-works)

<!-- tocstop -->

## Reusing your project’s webpack config

By default Styleguidist will try to find `webpack.config.js` in your project’s root directory and use it.

If your webpack config is located somewhere else, you need to load it manually from your `styleguide.config.js`:

```javascript
// ./styleguide.config.js
module.exports = {
  webpackConfig: require('./configs/webpack.js')
}
```

Or if you want to merge it with other options:

```javascript
// ./styleguide.config.js
module.exports = {
  webpackConfig: Object.assign({}, require('./configs/webpack.js'), {
    /* Custom config options */
  })
}
```

> **Note:** `entry`, `externals`, `output`, `watch`, and `stats` options will be ignored. For production builds, `devtool` will also be ignored.

> **Note:** `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` plugins will be ignored because Styleguidist already includes them or they may break Styleguidist.

> **Note:** If your loaders don’t work with Styleguidist try to make `include` and `exclude` absolute paths.

> **Note:** Babelified webpack configs (like `webpack.config.babel.js`) are not supported. We recommend to convert your config to native Node — Node 6 supports [many ES6 features](http://node.green/).

> **Note:** Use [webpack-merge](https://github.com/survivejs/webpack-merge) for easier config merging.

## Custom webpack config

Add a `webpackConfig` section to your `styleguide.config.js`:

```javascript
// ./styleguide.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')
module.exports = {
  webpackConfig: {
    module: {
      rules: [
        // Vue loader
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        // Babel loader, will use your project’s .babelrc
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
        }
      ]
    },
    plugins: [
      // add vue-loader plugin
      new VueLoaderPlugin()
    ]
  }
}
```

> **Warning:** This option disables config load from `webpack.config.js`, see above how to load your config manually.

> **Note:** `entry`, `externals`, `output`, `watch`, and `stats` options will be ignored. For production builds, `devtool` will also be ignored.

> **Note:** `CommonsChunkPlugins`, `HtmlWebpackPlugin`, `UglifyJsPlugin`, `HotModuleReplacementPlugin` plugins will be ignored because Styleguidist already includes them or they may break Styleguidist.

> **Note:** it's expected that you already have `vue-loader` dependency in your project.

## When nothing else works

In very rare cases, like using legacy or third-party libraries, you may need to change webpack options that Styleguidist doesn’t allow you to change via `webpackConfig` options. In this case you can use [dangerouslyUpdateWebpackConfig](Configuration.md#dangerouslyupdatewebpackconfig) option.

> **Warning:** You may easily break Vue styleguidist using this options, use it at your own risk.
