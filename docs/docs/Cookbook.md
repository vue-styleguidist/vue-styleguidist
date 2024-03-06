# Cookbook

<!-- toc -->

- [How to add third-party plugins to the style guide?](#how-to-add-third-party-plugins-to-the-style-guide)
- [How to add vuex to the style guide?](#how-to-add-vuex-to-the-style-guide)
- [How to add dummy data to the style guide?](#how-to-add-dummy-data-to-the-style-guide)
- [How to exclude some components from the style guide?](#how-to-exclude-some-components-from-the-style-guide)
- [How to hide some components in a style guide but make them available in examples?](#how-to-hide-some-components-in-a-style-guide-but-make-them-available-in-examples)
- [How to add custom JavaScript and CSS or polyfills?](#how-to-add-custom-javascript-and-css-or-polyfills)
- [How to change styles of a style guide?](#how-to-change-styles-of-a-style-guide)
- [How to change style guide dev server logs output?](#how-to-change-style-guide-dev-server-logs-output)
- [How to debug my components and examples?](#how-to-debug-my-components-and-examples)
- [How to debug the exceptions thrown from my components?](#how-to-debug-the-exceptions-thrown-from-my-components)
- [How to use Vagrant with Styleguidist?](#how-to-use-vagrant-with-styleguidist)
- [How to document styled-components?](#how-to-document-styled-components)
- [Use vue-styleguidist with components that contain routing](#use-vue-styleguidist-with-components-that-contain-routing)
- [How to include FontAwesome (or other icon sets) in your style guide](#how-to-include-fontawesome-or-other-icon-sets-in-your-style-guide)
- [How to use vue-styleguidist with multiple packages for components](#how-to-use-vue-styleguidist-with-multiple-packages-for-components)
- [I have multiple components in the same folder what can I do?](#i-have-multiple-components-in-the-same-folder-what-can-i-do)
- [How do I integrate Styleguidist into an existing Nuxtjs site?](#how-do-i-integrate-styleguidist-into-an-existing-nuxtjs-site)
- [How to use component name in examples with a different displayName](#how-to-use-component-name-in-examples-with-a-different-displayname)

<!-- tocstop -->

## How to add third-party plugins to the style guide?

Styleguidist does not load a `main.js` file. To install plugins and component libraries, you will need to require then somewhere else.

### Vue 3

First create a `.js` file that installs the plugins into an existing Vue app. Then add it into the `styleguide.config.js` file [enhancePreviewApp](/Configuration.md#enhancePreviewApp) option:

`styleguide.config.js`

```javascript
module.exports = {
  enhancePreviewApp: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

`styleguide/global.requires.js`

```javascript
import VCalendar from "v-calendar"
import "v-calendar/style.css"

export default function (app) {
  app.use(VCalendar, {})
}
```


### Vue 2

First create a `.js` file that installs the plugins. Then add it into the `styleguide.config.js` file [require](/Configuration.md#require) option:

`styleguide.config.js`

```javascript
module.exports = {
  require: [path.join(__dirname, 'styleguide/global.requires.js')]
}
```

`styleguide/global.requires.js`

```javascript
import Vue from 'vue'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
// import full version fo vuetify (see NOTE)
import Vuetify from 'vuetify'
// get the exported options from the plugin to avoid rewriting them
import { opts } from '../src/plugins/vuetify'

Vue.use(VueI18n)
Vue.use(VeeValidate)
Vue.use(Vuetify, opts)
```

### Changing the root component of preview examples

If you need to change the root component of each preview example, you can change the root component of the preview. Creating a `.js` file that exports the root component as [jsx component](https://vuejs.org/v2/guide/render-function.html) and then adds it into the `styleguide.config.js` file

Use [renderRootJsx](/Configuration.md#renderrootjsx) option:

```javascript
// config/styleguide.root.js
import VueI18n from 'vue-i18n'
import Vuetify from 'vuetify'
import messages from './i18n'

const i18n = new VueI18n({
  locale: 'en',
  messages
})

export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    i18n,
    // let's not forget to add all necessary info to
    // each vue app root about vuetify
    vuetify: new Vuetify(),
    render(createElement) {
      // v-app to support vuetify plugin
      return createElement('v-app', [createElement(previewComponent)])
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

See an example of [style guide with vuetify and vue-i18n](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/vuetify).

**NOTE** Since Styleguidist creates one root per example (for isolation), installing Vuetify with the default optimized way will not work. Instead, you should prefer installing it globally by following the setup above.

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

Use [require](/Configuration.md#require) option:

```javascript
// styleguide.config.js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

See an example of [style guide with vuex](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/vuex).

## How to add dummy data to the style guide?

You can use [global mixins](https://vuejs.org/v2/guide/mixins.html#Global-Mixin) to add dummy data:

Use [require](/Configuration.md#require) option:

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

## How to exclude some components from the style guide?

Vue Styleguidist will ignore tests (`__tests__` folder) by default.

Use [ignore](/Configuration.md#ignore) option to customize this behavior:

```javascript
module.exports = {
  ignore: ['**/*.spec.vue', '**/components/Button.vue']
}
```

> **Note:** You should pass glob patterns, for example, use `**/components/Button.vue` instead of `components/Button.vue`.

## How to hide some components in a style guide but make them available in examples?

- Unless we use [locallyRegisterComponents](/Configuration.md#locallyregistercomponents) all documented components are available in every example.
- If we exclude components from the sidebar and documentation, using the [ignore](/Configuration.md#ignore) configuration they become unavailable for examples.
- Use the [require](/Configuration.md#require) option to load a file where we will register our hidden components.

### A concrete example:

**Problem:** I do not want to document any component whose filename starts with an underscore (`_`).

```js
module.exports = {
  // load install.components.js for every page and example
  require: ['./docs/install.components.js'],
  // register all the components
  components: 'src/components/**/*.vue',
  // avoid documenting components that start with _
  ignore: ['**/_*.vue']
}
```

If you started with a vue-cli install, or just installed styleguidist, `docs/install.components.js` the file metionned in the [require](/Configuration.md#require) option does not exist in your codebase.

> **NOTE** `docs/install.components.js` above is a file name we chose. It matters not to styleguidist what name you choose so choose one that makes sense to you.

First we create `docs/install.components.js`. Then, we will use the node 6 function require (or require.context since we are in webpack context) to gather the components we want to use in examples.

Finally, we will register them using the `Vue.component()` function.

The components starting with an underscore are now available in every example (without the underscore).

```js
import Vue from 'vue'
import * as path from 'path'

const registerAllComponents = components => {
  // For each matching file name...
  components.keys().forEach(fileName => {
    // Get the component config
    const componentConfig = components(fileName)

    // get the component name from the object
    const componentName =
      componentConfig.default.name ||
      componentConfig.name ||
      // or from the filename, removing any character
      // that would not fit in a component name
      path.basename(fileName, '.vue').replace(/[^0-9a-zA-Z]/, '')

    // Globally register the component
    Vue.component(
      componentName,
      componentConfig.default || componentConfig
    )
  })
}

// register all components with a file name starting with _
registerAllComponents(
  require.context('../src/', true, /[\\/]_.+\.vue$/)
)
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

There are two config options to change your style guide UI: [theme](/Configuration.md#theme) and [styles](/Configuration.md#styles).

Use [theme](/Configuration.md#theme) to change fonts, colors, etc.

Use [styles](/Configuration.md#styles) to tweak the style of any particular Styleguidist component.

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
      // We're changing the LogoRenderer component
      logo: {
        // We're changing the rsg--logo-XX class name inside the component
        animation: 'blink ease-in-out 300ms infinite'
      },
      '@keyframes blink': {
        to: { opacity: 0 }
      }
    }
  }
}
```

> **Note:** See available [theme variables](https://github.com/styleguidist/react-styleguidist/blob/master/src/client/styles/theme.ts).

> **Note:** Styles use [JSS](https://github.com/cssinjs/jss/blob/master/docs/jss-syntax.md) with these plugins: [jss-isolate](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-isolate), [jss-nested](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-nested), [jss-camel-case](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-camel-case), [jss-default-unit](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-default-unit), [jss-compose](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-compose) and [jss-global](https://github.com/cssinjs/jss/tree/master/packages/jss-plugin-global).

> **Note:** Use [React Developer Tools](https://github.com/facebook/react) to find component and style names. For example a component `<LogoRenderer><h1 className="rsg--logo-53">` corresponds to an example above.

> **Note:** Use a function instead of an object for [styles](/Configuration.md#styles) to access all theme variables in your custom styles.

```javascript
module.exports = {
  styles: function (theme) {
    return {
      Logo: {
        logo: {
          // we can now change the color used in the logo item to use the theme's `link` color
          color: theme.color.link
        }
      }
    }
  }
}
```

> NOTA: If you need to reference the original component, you can do so by importing the `rsg-components-default` version. Check out the [customized](https://github.com/vue-styleguidist/vue-styleguidist/tree/delivery/examples/customised) example, it uses the following:

```jsx
// SectionsRenderer.js
import React from 'react'
import PropTypes from 'prop-types'
import Styled from 'rsg-components/Styled'
import Heading from 'rsg-components/Heading'

// Avoid circular ref
// Import default implementation using `rsg-components-default`
import DefaultSectionsRenderer from 'rsg-components-default/Sections/SectionsRenderer'

const styles = ({ fontFamily, color, space }) => ({
  headingSpacer: {
    marginBottom: space[2]
  },
  descriptionText: {
    marginTop: space[0],
    fontFamily: fontFamily.base
  }
})

export function SectionsRenderer({ classes, children }) {
  return (
    <div>
      {!!children.length && (
        <div className={classes.headingSpacer}>
          <Heading level={1}>Example Components</Heading>
          <p className={classes.descriptionText}>
            These are the greatest components
          </p>
        </div>
      )}
      <DefaultSectionsRenderer>{children}</DefaultSectionsRenderer>
    </div>
  )
}

SectionsRenderer.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.node
}

export default Styled(styles)(SectionsRenderer)
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
3.  Press the ![Continue](https://d3vv6lp55qjaqc.cloudfront.net/items/3b3c1P3g3O1h3q111I2l/continue.png) button and the debugger will stop the browser from running JavaScript at the next exception.

## How to use Vagrant with Styleguidist?

First read [Vagrant guide](https://webpack.js.org/guides/development-vagrant/) from the webpack documentation. Then enable polling in your webpack config:

```js
devServer: {
  watchOptions: {
    poll: true
  }
}
```

## How to document styled-components?

To document styled-components you need to get them recognized by vue-docgen-api. The simplest way is to use extends:

```js
import styled from 'vue-styled-components'

const _StyledTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

export default {
  extends: _StyledTitle
}
```

or if you are using with the class component syntax

```js
import styled from 'vue-styled-components'

const _StyledTitle = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`

@Components({ extends: _StyledTitle })
export default class StyledTitle extends Vue {}
```

## Use vue-styleguidist with components that contain routing

If your components contain `<router-link>` the best way is, in your styleguide to mock it. In the `styelguide.config,js` file add `styleguide.global.required.js` (see below) to the [require](/Configuration.md#require) parameter. Styleguidist will render `router-link` as an anchor or tag of your choosing. Don't use `vue-router` inside vue-styleguidist. It will conflict with its internal router.

```js
// styleguide.global.requires.js
import Vue from 'vue'
Vue.component('RouterLink', {
  props: {
    tag: { type: String, default: 'a' }
  },
  render(createElement) {
    return createElement(this.tag, {}, this.$slots.default)
  }
})
```

See [this example](/Examples#router) for a concrete implementation.

> PRO TIP: If your styleguide has `.resolve` issues in the browser console, it still seems to be using vue-router. Check if you are requiring the `router.js` file in any of the showcased components and remove the dependency. If you still can't find the culprit, follow these steps and you will find it.
>
> 1.  Find all mentions of `Vue.use(Router)` in your codebase
> 1.  Add `console.trace()` on the line before it to get the stack trace of the way they are called
> 1.  open styleguidist and look at the console of your browser
>
> Somewhere in your stack should be one of the displayed components. Find a way to avoid this require. If you can't find a way around this require, use a context variable to only load the router when not in styleguidist.
>
> 1.  Install `cross-env` package
> 1.  Set a context variable before you launch styleguidist: `cross-env MYSTYLE=true styleguide serve`
> 1.  Use the variable in your code as follows
>
> ```js
> if (!process.env.MYSTYLE) {
>   Vue.use(Router)
> }
> ```

## How to include FontAwesome (or other icon sets) in your style guide

If your components rely on an icon set such as FontAwesome, you can edit `styleguide.config.js` to import it:

```js
module.exports = {
  title: 'My Style Guide',
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href:
            'https://pro.fontawesome.com/releases/v5.8.2/css/all.css',
          integrity: 'your hash here',
          crossorigin: 'anonymous'
        }
      ]
    }
  }
}
```

See [`template`](/Configuration.md#template) for more details.

## How to use vue-styleguidist with multiple packages for components

If your base components are in one package and the derived components are in another, you will want the documentation to reflect extended components props in the exposed ones.

Say you have a `BaseButton.vue` in a `@scoped/core` package that you extend into `IconButton.vue` in the `@scoped/extended` package, the `BaseButton.vue` props are not going to be documented with `IconButton.vue`. This can be what you want, or you could be missing a lot of props.

Use the [validExtends](/Configuration.md#validExtends) option to allow parsing of extended components in other packages.

```javascript
module.exports = {
  // Add the following function to your styleguide.config.js
  validExtends(fullFilePath) {
    return (
      /[\\/]@scoped[\\/]core[\\/]/.test(fullFilePath) ||
      !/[\\/]node_modules[\\/]/.test(fullFilePath)
    )
  }
}
```

## I have multiple components in the same folder what can I do?

If multiple documented components live in the same folder, and you are using a `ReadMe` file to document them, the content of the readme is going to show for every component.

Three solutions are available depending on taste and context.

### the docs block

The simplest solution is to use the `<docs>` block instead. It works well with Vetur syntax highlighting and allows you to never forget to update the documentation.

Trade-off: Markdown files can be read without rendering, in Github for example while coding the component itself. Vue files cannot.

### Named readmes

Use the name of the component file switching `.vue` with `.md` and you can have one documentation file per component in the folder.

Trade-off: When you enter a folder, Github automatically displays the readme file if it exists. The files you would be writing would not be readmes. No automated file would be loaded.

### Remove unwanted documentations

[Documentation](/docs/Documenting.html#ignore-examples-files)

In the tags of a component, an `@example` doclet can be specified. It is usually used to tell styleguidist where to find more documentation.

It can also be used with the special value `[none]`. It will then hide the example file that would normally be associated with the component.

If you hide with `@examples [none]` all non-main components, the only remaining readme displayed will the main one. We get our `readme` file back.

## How do I integrate Styleguidist into an existing Nuxtjs site?

Suppose you have an existing Nuxtjs site or are using Nuxtjs as your development environment for your component library. While you could also encourage users to clone your repo and build the docs, it would be nice to integrate them into your existing Nuxtjs site. This is possible (with some caveats).

First you need to determine the route you want your styleguist docs to be at. For example you may want your docs to be at `www.mysite.com/docs`. If styleguidist was a pure nuxt page, under the Nuxtjs convention, it would be the file `pages/docs.vue`. So wherever you want your styleguidist documentation to reside you can **not** have a `pages/<dest>.vue` file there!

Next you need to set up the generate properties of the `nuxt.config.js`. If you are deploying on GitLab, it might be something like this:

```js
// nuxt.config.js
export default {
  // ...
  generate: {
    dir: 'public'
  }
  // ...
}
```

If you have generated a nuxtjs site before and looked at the output (here under a dir call `public`) you will see that each `pages/<dest>.vue` is a sub directory. This is why you can not have your desired location for styleguidest also be a `dest.vue` file.

Now you will want to update your `styleguide.config.js` file to point `styleguidDir` to the `nuxt.config.js`'s `generate.dir`, e.g. if you wanted the `/docs` to be where the styleguideist documentation to be and `generate.dir='public'` then `styleguidDir=public/docs`.

Then the last thing is to remember the order of operations. First you generate nuxt (`npm run generate`) and then `build` your styleguidist docs.

## How to use component name in examples with a different displayName

When using `displayName`, components in the `<docs>` block must be imported with their `displayName` instead of their `name`.  
This is not ideal as your examples are not using the real component name.

A way to get around the problem is to create an alias component, with its original name.

Modify the [root element](/Configuration.md#renderrootjsx) as follow:

```js
// config/styleguide.root.js
import Vue from 'vue';

export default previewComponent => {
  return {
    render(createElement) {
      return createElement(previewComponent);
    },
    created() {
      // For each globally registered component,
      // create an alias if its name doesn't match its displayName
      Object.entries(Vue.options.components).forEach(c => {
        const displayName = c[0];
        const component = c[1];
        const { name } = component.extendOptions;

        // If display name is different than name, create an alias of the component
        // Ex: AcAlert component displayName is Alert
        //     We then create AcAlert, an alias of Alert, to be used in <docs> block
        if (displayName !== name) {
          Vue.component(name, component);
        }
      });
    },
}
```

```js
module.exports = {
  renderRootJsx: path.join(__dirname, 'config/styleguide.root.js')
}
```

You can now use `<AcAlert />` in `<docs>` while the left menu displays `Alert`.  
Example:

````vue
<script>
/**
 * @displayName Alert
 */
export default {
  name: 'AcAlert'
}
</script>

<template>
  <div>AcAlert</div>
</template>

<docs>
  # Usage ```js
  <AcAlert />
  <Alert
/></docs>
````


> :warning: The search menu won't be able to find `AcAlert` anymore, as it searches through the page names, thus `Alert`.
