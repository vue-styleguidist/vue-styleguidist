# Documenting components

Vue styleguidist generates documentation for your components based on the comments in your source code declarations and Readme files.

> **Note:** [See examples](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/examples/basic/src/components) of documented components in our demo style guide.

<!-- To update run: npx markdown-toc --maxdepth 2 -i docs/Documenting.md -->

<!-- toc -->

- [Code comments](#code-comments)
- [Slots documentation](#slots-documentation)
- [Include Mixins and Extends](#include-mixins-and-extends)
- [Usage examples and Readme files](#usage-examples-and-readme-files)
- [External examples using doclet tags](#external-examples-using-doclet-tags)
- [Public methods](#public-methods)
- [Ignoring props](#ignoring-props)
- [Using JSDoc tags](#using-jsdoc-tags)
- [Writing code examples](#writing-code-examples)

<!-- tocstop -->

## Code comments

Vue styleguidist will display your components’ JSDoc comment blocks.

```html
<template>
  <div class="Button">
    /* ... */
  </div>
</template>

<script>

/**
 * The only true button.
 */
export default {
  name: 'Button',
  props: {
    /**
    * The color for the button.
    */
    color: {
      type: String,
      default: '#333'
    },
    /**
    * The size of the button
    * `small, normal, large`
    */
    size: {
      type: String,
      default: 'normal'
    },
    /**
    * Gets called when the user clicks on the button
    */
    onClick: {
      type:Function,
      default: (event) => {
        console.log('You have clicked me!', event.target);
      }
    }
  },
  /* ... */
}
</script>
```

If you want create a custom [v-model](https://vuejs.org/v2/guide/components.html#Customizing-Component-v-model), you have to add `model` tag in comment

```html
<script>
export default {
  name: 'my-checkbox',
  props: {
    /**
     * @model
     */
    value: String
  }
}
</script>
```

For events documentation

```js
/**
 * Success event.
 *
 * @event success
 * @type {object}
 */
this.$emit('success', {
  demo: 'example'
})
```

> **Note:** You can change its behavior using [propsParser](Configuration.md#propsparser) options.

> **Note:** Component’s and documentation comments are parsed by the [vue-docgen-api](https://github.com/vue-styleguidist/vue-docgen-api) library.

> **Note:** The 'name' property in the component is mandatory, as it will be the component name to use in the examples. If you need to configure the component name before you document it, you can review the following [example](https://github.com/vue-styleguidist/buefy-styleguide-example/blob/master/styleguide.config.js#L43)

## Slots documentation

For default, Vue styleguidist doesn't document the slots, you need to add a comment before slot inside of the template using the @slot notation.

```html
<template>
  <div class="modal">
    <div class="modal-container">
      <div class="modal-head">
        <!-- @slot Use this slot header -->
        <slot name="head"></slot>
      </div>
      <div class="modal-body">
        <!-- @slot Use this slot body -->
        <slot name="body"></slot>
      </div>
    </div>
  </div>
</template>
```

## Include Mixins and Extends

If you import a [mixin](https://vuejs.org/v2/guide/mixins.html) or [extends](https://vuejs.org/v2/api/#extends), for it to be documented you need to add in the header the mixin tag **@mixin**, for example

Case Mixin:

```javascript
// src/mixins/colorMixin.js

/**
 * @mixin
 */
module.exports = {
  props: {
    /**
     * The color for the button example
     */
    color: {
      type: String,
      default: '#333'
    }
  }
}
```

Case Extends:

```vue
// src/extends/Base.vue

<template>
  <div>
    <h4>{{ color }}</h4>
    <!--the appropriate input should go here-->
  </div>
</template>
<script>
/**
 * @mixin
 */
export default {
  props: {
    /**
     * The color for the button example
     */
    colorExtends: {
      type: String,
      default: '#333'
    }
  }
}
</script>
```

```html
<template>
<!-- -->
</template>
<script>
// src/components/Button/Button.vue

import colorMixin from '../../mixins/colorMixin';
import Base from '../../extends/Base.vue';
export default {
  name: 'Button',
  mixins: [colorMixin],
  extends: Base,
  props: {
    /**
    * The size of the button
    * `small, normal, large`
    */
    size: {
      default: 'normal'
    },
    /**
    * Add custom click actions.
    **/
    onCustomClick: {
      default: () => () => null,
    },
  },
  /* ... */
}
</script>
```

## Usage examples and Readme files

Vue styleguidist will look for any `Readme.md` or `ComponentName.md` files in the component’s folder and display them. Any code block with a language tag of `vue`, `js`, `jsx` or `javascript` will be rendered as a React component with an interactive playground.

    Vue component example:

    ```jsx
        <Button size="large">Push Me</Button>
    ```

    One more with generic code fence:

    ```
    <Button size="large">Push Me</Button>
    ```

    You can disable an editor by passing a `noeditor` modifier:

    ```jsx noeditor
    <Button>Push Me</Button>
    ```

    To render an example as highlighted source code add a `static` modifier:

    ```jsx static
    <Button>Push Me</Button>
    ```

    You can also initialize vue to construct more complex examples in two ways:

    1. Create a new Vue instance

    ```js
    const names = require('dog-names').all;

    new Vue({
      data(){
        return {
          list: names
        }
      },
      template: `
        <div>
          <RandomButton :variants="list" />
        </div>
      `
    })
    ```

    2. Single-file components with a language tag of vue (supports <style scoped>)

    ```vue
      <template>
        <div class="wrapper">
          <Button id="dog-name-button" @click.native="pushButton">Push Me</Button>
          <hr />
          <p class="text-name">Next Dog Name: {{ dogName }}</p>
        </div>
      </template>

      <script>
        const dogNames = require('dog-names').all;

        // You can also use 'exports.default = {}' style module exports.
        export default {
          data() {
            return { numClicks: 0, dogName: dogNames[0] };
          },
          methods: {
            pushButton() {
              this.numClicks += 1;
              this.dogName = dogNames[this.numClicks];
            }
          }
        }
      </script>

      <style scoped>
        .wrapper {
          background: blue;
        }
        .text-name {
          color: red;
        }
      </style>
    ```

    Examples with all other languages are rendered only as highlighted source code, not an actual component:

    ```html
    <Button size="large">Push Me</Button>
    ```

    Any [Markdown](http://daringfireball.net/projects/markdown/) is **allowed** _here_.

> **Note:** You can configure examples file name with the [getExampleFilename](Configuration.md#getexamplefilename) option.

You can also add the [custom block](https://vue-loader.vuejs.org/en/configurations/custom-blocks.html) `<docs></docs>` inside `*.vue` files, so that vue styleguidist builds the readme. You can review the following [example](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/examples/basic/src/components/Button/Button.vue#L85)

## External examples using doclet tags

Additional example files can be associated with components using `@example` doclet syntax.

The following component will also have an example loaded from the `extra.examples.md` file:

```javascript
/**
 * Component is described here.
 *
 * @example ./extra.examples.md
 */
export default {
  name: 'Button'
  // ...
}
```

> **Note:** You’ll need a regular example file (like `Readme.md`) too when [skipComponentsWithoutExample](Configuration.md#skipcomponentswithoutexample) is `true`.

## Public methods

By default, any methods your components have are considered to be private and are not published. Mark your public methods with JSDoc [`@public`](http://usejsdoc.org/tags-public.html) tag to get them published in the docs:

```javascript
/**
 * Insert text at cursor position.
 *
 * @param {string} text
 * @public
 */
insertAtCursor(text) {
  // ...
}
```

## Ignoring props

By default, all props your components have are considered to be public and are published. In some rare cases you might want to remove a prop from the documentation while keeping it in the code. To do so, mark the prop with JSDoc [`@ignore`](http://usejsdoc.org/tags-ignore.html) tag to remove it from the docs:

```javascript
  props: {
    /**
    * @ignore
    */
    color: {
      type: String,
      default: '#333'
    }
```

## Using JSDoc tags

You can use the following [JSDoc](http://usejsdoc.org/) tags when documenting components, props and methods:

- [@deprecated](http://usejsdoc.org/tags-deprecated.html)
- [@see, @link](http://usejsdoc.org/tags-see.html)
- [@author](http://usejsdoc.org/tags-author.html)
- [@since](http://usejsdoc.org/tags-since.html)
- [@version](http://usejsdoc.org/tags-version.html)

When documenting methods you can also use:

- [@param, @arg, @argument](http://usejsdoc.org/tags-param.html)

Documenting events:

- [@event, @type](http://usejsdoc.org/tags-event.html)

Documenting v-model:

- @model

All tags can render Markdown.

```html
<template>
  <!-- -->
</template>

<script>

/**
* The only true button.
* @version 1.0.1
*/
export default {
  name: 'Button',
  props: {
    /**
    * The color for the button.
    * @see See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names)
    * @see See [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value) for a list of color names
    */
    color: {
      type: String,
      default: '#333'
    },
    /**
    * The size of the button
    * `small, normal, large`
    * @since Version 1.0.1
    */
    size: {
      type: String,
      default: 'normal'
    },
    /**
    * Gets called when the user clicks on the button
    */
    onClick: {
      type:Function,
      default: (event) => {
        console.log('You have clicked me!', event.target);
      }
    }
  },
  methods: {
    /**
     * Gets called when the user clicks on the button
     *
     * @param {SyntheticEvent} event The react `SyntheticEvent`
     * @param {Number} num Numbers of examples
     */
    launch(event, num){
      /* ... */
    },
    // ...
    ignoreMethod(){
      /**
      * Success event.
      *
      * @event success
      * @type {object}
      */
      this.$emit('success', {})
    }
  },
  /* ... */
}
</script>
```

## Writing code examples

Code examples in Markdown use the ES6 syntax. They can access all the components of your style guide using global variables:

```jsx
<Panel>
  <p>
    Using the Button component in the example of the Panel component:
  </p>
  <Button>Push Me</Button>
</Panel>
```

> **Note:** Vue styleguidist uses [Bublé](https://buble.surge.sh/guide/) to run ES6 code on the frontend, it supports [most of the ES6 features](https://buble.surge.sh/guide/#unsupported-features).

You can also `require` other modules (e.g. mock data that you use in your unit tests) from examples in Markdown:

```jsx
const mockData = require('./mocks');
<Message :content="mockData.hello" />
```

> **Note:** You can `require` only from examples in Markdown files. ES6 `import` syntax isn’t supported.

> **Note:** If you need a more complex demo it’s often a good idea to define it in a separate JavaScript file and `require` it in Markdown
