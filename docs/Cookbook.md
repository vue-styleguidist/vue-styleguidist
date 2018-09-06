# Cookbook

<!-- To update run: npx markdown-toc --maxdepth 2 -i docs/Cookbook.md -->

<!-- toc -->

- [How to add third-party plugins to the style guide?](#how-to-add-third-party-plugins-to-the-style-guide)
- [How to add vuex to the style guide?](#how-to-add-vuex-to-the-style-guide)
- [How to add data dummy to the style guide?](#how-to-add-data-dummy-to-the-style-guide)
- [How to exclude some components from style guide?](#how-to-exclude-some-components-from-style-guide)
- [How to hide some components in style guide but make them available in examples?](#how-to-hide-some-components-in-style-guide-but-make-them-available-in-examples)
- [How to add custom JavaScript and CSS or polyfills?](#how-to-add-custom-javascript-and-css-or-polyfills)
- [How to change styles of a style guide?](#how-to-change-styles-of-a-style-guide)
- [How to change the layout of a style guide?](#how-to-change-the-layout-of-a-style-guide)
- [How to change style guide dev server logs output?](#how-to-change-style-guide-dev-server-logs-output)
- [How to debug my components and examples?](#how-to-debug-my-components-and-examples)
- [How to debug the exceptions thrown from my components?](#how-to-debug-the-exceptions-thrown-from-my-components)
- [How to use Vagrant with Styleguidist?](#how-to-use-vagrant-with-styleguidist)
- [How to reuse project’s webpack config?](#how-to-reuse-projects-webpack-config)

<!-- tocstop -->

## How to add third-party plugins to the style guide?

If you need to load vue plugins from a third party. You can add it, creating a .js file that installs the plugins and then adds it into the `styleguide.config.js` file

Use [require](Configuration.md#require) option:

```javascript
// styleguide/global.requires.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VeeValidate from 'vee-validate'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(VueI18n)
Vue.use(VeeValidate)
Vue.use(Vuetify)
```

```javascript
// styleguide.config.js
module.exports = {
  require: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

If you need to change the root component of each preview example, you can change the root component of preview. Creating a .js file that exports the root component as [jsx component](https://vuejs.org/v2/guide/render-function.html) and then adds it into the `styleguide.config.js` file

Use [renderRootJsx](Configuration.md#renderrootjsx) option:

```javascript
// config/styleguide.root.js
import VueI18n from 'vue-i18n'
import messages from './i18n'

const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    i18n,
    render(createElement) {
      // v-app to support vuetify plugin
      return createElement(
        'v-app',
        {
          props: {
            id: 'v-app'
          }
        },
        [createElement(previewComponent)]
      )
    }
  }
}
```

```javascript
// styleguide.config.js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

See an example of [style guide with vuetify and vue-i18n](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/examples/vuetify).

## How to add vuex to the style guide?

You can add it, creating a .js file that installs the plugins and then adds it into the `styleguide.config.js` file

```javascript
// config/styleguide.root.js
import Vue from 'vue'
import Vuex from 'vuex'
import { state, mutations, getters } from './mutations'

Vue.use(Vuex)

const store = new Vuex.Store({
  state,
  getters,
  mutations
})

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    store,
    render(createElement) {
      return createElement(previewComponent)
    }
  }
}
```

Use [require](Configuration.md#require) option:

```javascript
// styleguide.config.js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

See an example of [style guide with vuex](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/examples/vuex).

## How to add data dummy to the style guide?

You can use [global mixins](https://vuejs.org/v2/guide/mixins.html#Global-Mixin) to add data dummy:

Use [require](Configuration.md#require) option:

```javascript
// styleguide/global.requires.js
import Vue from 'vue'

Vue.mixin({
  data() {
    return {
      colorDemo: 'blue',
      sizeDemo: 'large'
    }
  }
})
```

```javascript
// styleguide.config.js
module.exports = {
  require: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

```jsx
// example component

<Button size="colorDemo" color="sizeDemo">
  Click Me
</Button>
```

## How to exclude some components from style guide?

Vue Styleguidist will ignore tests (`__tests__` folder) by default.

Use [ignore](Configuration.md#ignore) option to customize this behavior:

```javascript
module.exports = {
  ignore: ['**/*.spec.vue', '**/components/Button.vue']
}
```

> **Note:** You should pass glob patterns, for example, use `**/components/Button.vue` instead of `components/Button.vue`.

## How to hide some components in style guide but make them available in examples?

Enable [skipComponentsWithoutExample](Configuration.md#skipcomponentswithoutexample) option and do not add example file (`Readme.md` by default) to components you want to ignore.

Require these components in your examples:

```jsx
const Vue = require('vue').default
const Button = require('./Button.vue').default
Vue.component('Button', Button)

<Button>Push Me</Button>
```

## How to add custom JavaScript and CSS or polyfills?

In your style guide config:

```javascript
const path = require('path')
module.exports = {
  require: [
    'babel-polyfill',
    path.join(__dirname, 'path/to/script.js'),
    path.join(__dirname, 'path/to/styles.css')
  ]
}
```

## How to change styles of a style guide?

There are two config options to change your style guide UI: [theme](Configuration.md#theme) and [styles](Configuration.md#styles).

Use [theme](Configuration.md#theme) to change fonts, colors, etc.

Use [styles](Configuration.md#styles) to tweak the style of any particular Styleguidist component.

As an example:

```javascript
module.exports = {
  theme: {
    color: {
      link: 'firebrick',
      linkHover: 'salmon'
    },
    fontFamily: {
      base: '"Comic Sans MS", "Comic Sans", cursive'
    }
  },
  styles: {
    Logo: {
      logo: {
        animation: 'blink ease-in-out 300ms infinite'
      },
      '@keyframes blink': {
        to: { opacity: 0 }
      }
    }
  }
}
```

> **Note:** See available [theme variables](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/src/styles/theme.js).

> **Note:** Styles use [JSS](https://github.com/cssinjs/jss/blob/master/docs/json-api.md) with these plugins: [jss-isolate](https://github.com/cssinjs/jss-isolate), [jss-nested](https://github.com/cssinjs/jss-nested), [jss-camel-case](https://github.com/cssinjs/jss-camel-case), [jss-default-unit](https://github.com/cssinjs/jss-default-unit), [jss-compose](https://github.com/cssinjs/jss-compose).

> **Note:** Use [React Developer Tools](https://github.com/facebook/react-devtools) to find component and style names. For example a component `<LogoRenderer><h1 className="logo-524678444">…` corresponds to an example above.

> **Note:** See [example](https://github.com/vue-styleguidist/buefy-styleguide-example/blob/master/docs-styleguidist/styles.js).

## How to change the layout of a style guide?

You can replace any Styleguidist Vue component. But in most of the cases you’ll want to replace `*Renderer` components — all HTML is rendered by these components. For example `ReactComponentRenderer`, `ComponentsListRenderer`, `PropsRenderer`, etc. — [check the source](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/src/rsg-components) to see what components are available.

You can replace the `StyleGuideRenderer` component like this:

```javascript
// styleguide.config.js
const path = require('path')
module.exports = {
  styleguideComponents: {
    StyleGuideRenderer: path.join(
      __dirname,
      'lib/styleguide/StyleGuideRenderer'
    )
  },
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.js?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          query: {
            cacheDirectory: true,
            presets: ['react', 'env']
          }
        }
        /* ... */
      ]
    }
  }
}
```

```jsx
// lib/styleguide/StyleGuideRenderer.js
import React from 'react'
const StyleGuideRenderer = ({
  title,
  homepageUrl,
  components,
  toc,
  hasSidebar
}) => (
  <div className="root">
    <h1>{title}</h1>
    <main className="wrapper">
      <div className="content">
        {components}
        <footer className="footer">
          <Markdown
            text={`Generated with [React Styleguidist](${homepageUrl})`}
          />
        </footer>
      </div>
      {hasSidebar && <div className="sidebar">{toc}</div>}
    </main>
  </div>
)
```

## How to change style guide dev server logs output?

You can modify webpack dev server logs format changing `stats` option of webpack config:

```javascript
module.exports = {
  webpackConfig(env) {
    if (env === 'development') {
      return {
        stats: {
          chunks: false,
          chunkModules: false,
          chunkOrigins: false
        }
      }
    }
    return {}
  }
}
```

## How to debug my components and examples?

1.  Open your browser’s developer tools
2.  Write `debugger;` statement wherever you want: in a component source, a Markdown example or even in an editor in a browser.

## How to debug the exceptions thrown from my components?

1.  Put `debugger;` statement at the beginning of your code.
2.  Press the ![Debugger](https://d3vv6lp55qjaqc.cloudfront.net/items/2h2q3N123N3G3R252o41/debugger.png) button in your browser’s developer tools.
3.  Press the ![Continue](https://d3vv6lp55qjaqc.cloudfront.net/items/3b3c1P3g3O1h3q111I2l/continue.png) button and the debugger will stop execution at the next exception.

## How to use Vagrant with Styleguidist?

First read [Vagrant guide](https://webpack.js.org/guides/development-vagrant/) from the webpack documentation. Then enable polling in your webpack config:

```js
devServer: {
  watchOptions: {
    poll: true
  }
}
```

## How to reuse project’s webpack config?

See in [configuring webpack](Webpack.md#reusing-your-projects-webpack-config).
