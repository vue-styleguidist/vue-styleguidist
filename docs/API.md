# Node.js API

<!-- To update run: npx markdown-toc --maxdepth 2 -i docs/API.md -->

<!-- toc -->

- [Initialization](#initialization)
- [Methods](#methods)
  * [`build(callback)`](#buildcallback)
    + [Arguments](#arguments)
    + [Returns](#returns)
    + [Example](#example)
  * [`server(callback)`](#servercallback)
    + [Arguments](#arguments-1)
    + [Returns](#returns-1)
    + [Example](#example-1)
  * [`makeWebpackConfig([env])`](#makewebpackconfigenv)
    + [Arguments](#arguments-2)
    + [Returns](#returns-2)
    + [Example](#example-2)

<!-- tocstop -->

## Initialization

First, you need to initialize the API for your style guide config.

Using a JavaScript object:

```javascript
const styleguidist = require('vue-styleguidist');
const styleguide = styleguidist({
  logger: {
		warn: console.warn,
		info: console.log,
		debug: console.log,
	},
  components: './lib/components/**/*.vue',
  webpackConfig: {
    module: {
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
          test: /\.css$/,
          loader: 'style-loader!css-loader?modules',
        },
      ],
    },
  },
});
```

**Note:** any output is disabled by default, you may need to define your own [logger](Configuration.md#logger).

Using a config file:

```javascript
const styleguidist = require('vue-styleguidist');
const styleguide = styleguidist(require('../styleguide.config.js'));
```

Or auto searching a config file:

```javascript
const styleguidist = require('vue-styleguidist');
const styleguide = styleguidist();
```

See all available [config options](Configuration.md).

## Methods

### `build(callback)`

#### Arguments

1. `callback(err, config, stats)` (*Function*): A callback to be invoked when style guide is built:
  1. `err` (*Object*): error details.
  2. `config` (*Object*): normalized style guide config.
  3. `stats` (*Object*): webpack build stats.

#### Returns

(*Compiler*): webpack `Compiler` instance.

#### Example

```javascript
const styleguidist = require('vue-styleguidist');
styleguidist(require('../styleguide.config.js')).build((err, config) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Style guide published to', config.styleguideDir);
  }
});
```


### `server(callback)`

#### Arguments

1. `callback(err, config)` (*Function*): A callback to be invoked when style guide is built:
  1. `err` (*Object*): error details.
  2. `config` (*Object*): normalized style guide config.

#### Returns

(*Compiler*): webpack `Compiler` instance.

#### Example

```javascript
const styleguidist = require('vue-styleguidist');
styleguidist(require('../styleguide.config.js')).server((err, config) => {
  if (err) {
    console.log(err);
  }
  else {
    console.log('Listening at http://' + config.serverHost + ':' + config.serverPort);
  }
});
```

### `makeWebpackConfig([env])`

#### Arguments

1. \[`env`=`'production'`\] (*String*): `production` or `development`.

#### Returns

(*Object*): webpack config.

#### Example

```javascript
// webpack.config.js
module.exports = [
    {
      // User webpack config
    },
    require('vue-styleguidist')().makeWebpackConfig(),
];
```
