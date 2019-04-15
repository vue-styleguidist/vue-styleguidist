# Developer guide

> Vue Styleguidist created from [React Styleguidist](https://github.com/styleguidist/react-styleguidist), implement additional support to read and compile .vue files.

<!-- toc -->

- [How it works](#how-it-works)
- [Webpack loaders and webpack configuration](#webpack-loaders-and-webpack-configuration)
- [React components](#react-components)
- [Styles](#styles)
- [Render vue components](#render-vue-components)

<!-- tocstop -->

Styleguidist isn’t an ordinary single page app and some design decisions may look confusing to an outsider. In this guide we’ll explain these decisions to un-confuse potential contributors.

The main thing is that we’re running two apps at the same time: user’s components and Styleguidist UI. They share a webpack configuration and have styles in the same scope (there’s only one scope in CSS). And we can control only one of these two apps: Styleguidist UI. That puts us under some restrictions:

- Our styles should not affect user component styles.
- User styles (especially global like Bootstrap) should not affect Styleguidist UI.
- `body` styles (like `font-family`) should affect user components as the user expects but not Styleguidist UI.

## How it works

Vue Styleguidist uses [vue-docgen-api](Docgen.md) to parse _source_ files (not transpiled). vue-docgen-api finds exported Vue components and generates documentation.

Styleguidist uses Markdown for documentation: each JavaScript code block is rendered as an interactive playground with [CodeMirror](http://codemirror.net/). To do that we extract all these code blocks using [Remark](http://remark.js.org/).

Webpack loaders (see below) generate JavaScript modules with all user components with their documentation and examples and pass all that to a React app which renders the style guide.

## Webpack loaders and webpack configuration

We use webpack loaders to hot reload the style guide on changes in user components, styles and Markdown documentation. We have three loaders ([loaders](https://github.com/vue-styleguidist/vue-styleguidist/tree/dev/packages/vue-styleguidist/loaders) folder):

- `styleguide-loader`: loads components and sections;
- `vuedoc-loader`: loads props documentation using [vue-docgen-api](Docgen.md);
- `examples-loader`: loads examples from Markdown files;

There are two more loaders — `css-loader` and `styles-loader` but they are just one-line aliases to corresponding webpack loaders. We don’t want to rely on webpack loader resolver because its behavior can be changed by user’s webpack config (Create React App does that for example). This way we can bypass webpack resolver and use Node resolver instead. These loaders are used like this:

```js
require('!!../../../loaders/style-loader!../../../loaders/css-loader!codemirror/lib/codemirror.css')
```

`!!` prefix tells webpack not to use any other loaders that may be listed in a webpack configuration to load this module. This ensures that user’s webpack configuration won’t affect Styleguidist.

Styleguidist tries to load and reuse user’s webpack config (`webpack.config.js` in project root folder). It works most of the time but has some restrictions: Styleguidist [ignores](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-styleguidist/scripts/utils/mergeWebpackConfig.js) some fields and plugins because they are already included (like `webpack.HotModuleReplacementPlugin`), don’t make sense for a style guide (like `output`) or may break Styleguidist (like `entry`).

We’re trying to keep Styleguidist’s own [webpack config](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-styleguidist/scripts/make-webpack-config.js) minimal to reduce clashes with user’s configuration.

## React components

Most of StyleGuidist UI components consist of two parts: `Foo/Foo.js` that contains all logic and `Foo/FooRenderer.js` that contains all markup and styles. This allows users to customize rendering by overriding `*Renderer` component using webpack aliases (or [styleguideComponents](Configuration.md#styleguidecomponents) config option):

```js
// styleguide.config.js
const path = require('path')
module.exports = {
  webpackConfig: {
    resolve: {
      alias: {
        'rsg-components/Wrapper': path.join(
          __dirname,
          'lib/styleguide/Wrapper'
        )
      }
    }
  }
}
```

All Styleguidist components should be imported like this: `import Foo from 'rsg-components/Foo'` to make aliases work.

Each component folder usually has several files:

- `Foo/Foo.js` (optional for simple components);
- `Foo/FooRenderer.js`;
- `Foo/Foo.spec.js` — tests;
- `Foo/index.js` — reexport of `Foo.js` or `FooRenderer.js`.

## Styles

For styles we use [JSS](http://cssinjs.org/), it allows users to customize their style guide and allows us to ensure styles isolations (thanks to [jss-isolate](http://cssinjs.org/jss-isolate/)). No user styles should affect Styleguidist UI and no Styleguidist styles should affect user components.

Use [classnames](https://github.com/JedWatson/classnames) to merge several class names or for conditional class names, import it as `cx` (`import cx from 'classnames'`).

We use `Styled` higher-order component to allow theming (see [theme](Configuration.md#theme) and [style](Configuration.md#style) style guide config options). Use it like this:

```jsx
import React from 'react'
import Styled from 'rsg-components/Styled'

export const styles = ({ fontFamily, fontSize, color }) => ({
  button: {
    fontSize: fontSize.base,
    fontFamily: fontFamily.base,
    color: color.light,
    '&:hover, &:active': {
      isolate: false,
      color: color.lightest
    }
  }
})

export function ExamplePlaceholderRenderer({ classes }) {
  return (
    <button className={classes.button}>I am a styled button</button>
  )
}
```

Check available theme variables in [src/styles/theme.js](https://github.com/styleguidist/react-styleguidist/blob/master/src/styles/theme.js).

Because of isolation and theming you need to explicitly declare `fontFamily`, `fontSize` and `color`. Add `isolate: false` to your hover styles, otherwise you’ll have to repeat base non-hover styles.

## Render vue components

To render vue components, styleguidist uses the [Preview.js](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/packages/vue-styleguidist/src/rsg-components/Preview/Preview.js) React component.

As soon as users open the page, Preview is mounted.

The function rendering examples when codemirror updates is `executeCode()`.

### Separate script from template

First we extract any JavaScript from it by doing this:

- if it contains `new Vue` return the contents as a script
- if it is a single file component extract template and script and compile the script
- else look at the first line that start with a `<` then everything that is before it is js and the rest will be html

### Prepare code

The scripts are transformed from es6 or jsx to es5 using buble. The names of the variables that are declared in the global scope are extracted since they cannot be used in an eval. The code is then wrapped in a `getConfig` function.

### Render example

First make sure that the mount point is ready and save it in a variable Second prepare the component by executing the funciton created above `exampleComponent()` And finally instanciate vue to mount our made up component in the mounting point

### Hot Reload

In order to enable hot reloading even when the site is compiled, we need to keep the root of the `Preview` component unchanged. We instead will play with whatever is inside this root. At unmmount, when the `Preview` component is Reloaded, we clear the vue instance to place a new one: `unmountPreview()`.
