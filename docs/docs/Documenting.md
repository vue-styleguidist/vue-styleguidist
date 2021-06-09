# Documenting components

Vue styleguidist generates documentation for your components based on the comments in your source code declarations and Readme files.

> **Note:** [See examples](/Examples.md) of documented components in our demo style guide.

<!-- toc -->

- [Code comments](#code-comments)
- [Available Tags](#available-tags)
- [Events](#events)
- [Slots](#slots)
- [Include Mixins and Extends](#include-mixins-and-extends)
- [Usage examples and Readme files](#usage-examples-and-readme-files)
- [Public methods](#public-methods)
- [Ignoring props](#ignoring-props)
- [Methods](#methods)
- [Composable Components](#composable-components)
- [TypeScript, Flow and Class-style Components](#typescript-flow-and-class-style-components)
- [JSX](#jsx)
- [Writing code examples](#writing-code-examples)
- [Importing examples](#importing-examples)

<!-- tocstop -->

## Code comments

Vue styleguidist will display the contents of your components’ JSDoc comment blocks.

> **Note:** Components and documentation comments are parsed by default by the [vue-docgen-api](Docgen.md) library. You can change this behavior using [propsParser](/Configuration.md#propsparser) options.

```html
<template>
  <div class="Button">
    /* ... */
  </div>
</template>

<script>
  /**
   * The only true button.
   * @displayName Best Button
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
       * @values small, normal, large
       */
      size: {
        type: String,
        default: 'normal'
      },
      /**
       * Gets called when the user clicks on the button
       */
      onClick: {
        type: Function,
        default: event => {
          console.log('You have clicked me!', event.target)
        }
      }
    }
    /* ... */
  }
</script>
```

Note the use of the @displayName tag to change the displayed name of your component. This top-level comment block must come _before_ the `export default` in your script tag.

If you want to document a custom [v-model](https://vuejs.org/v2/guide/components.html#Customizing-Component-v-model), you have to add `model` tag in comment

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

## Available Tags

You can use the following tags when documenting components, props and methods.

### @values

A common pattern in VueJs components is to have a limited number of valid values for a prop.

For instance, `size` would only accept `small`, `medium` and `large`.

To document this in styleguidist, use the `@values` tag:

```js
export default = {
    props: {
      /**
       * The size of the button
       * @values small, normal, large
       */
      size: {
        type: String,
        default: 'normal'
      }
    }
}
```

See also:

- [Live Example](https://vue-styleguidist.github.io/basic/#button)

### @example

Provide an example of how to use a documented item. The text that follows this tag will be displayed as highlighted code.

See also:

- This is a JSDoc tag: [@example](http://usejsdoc.org/tags-example.html)

### @deprecated

The @deprecated tag marks a symbol in your code as being deprecated:

```js
/**
 * An example-less button.
 * @deprecated Use the [only true button component](#button) instead
 */
```

See also:

- [Live Example](https://vue-styleguidist.github.io/basic/#randombutton)
- This is a JSDoc tag: [@deprecated](http://usejsdoc.org/tags-deprecated.html)

### @see, @link

- This is a JSDoc tag: [@see, @link](http://usejsdoc.org/tags-see.html)

### @author

- This is a JSDoc tag: [@author](http://usejsdoc.org/tags-author.html)

### @since

- This is a JSDoc tag: [@since](http://usejsdoc.org/tags-since.html)

### @version

- This is a JSDoc tag: [@version](http://usejsdoc.org/tags-version.html)

### @ignore

By default, all props your components have are considered to be public and are published. In some rare cases, you might want to remove a prop from the documentation while keeping it in the code. The `@ignore` tag allows you to do this. See here for more:

- [Ignoring Props](#ignoring-props)
- This is a JSDoc tag: [@ignore](http://usejsdoc.org/tags-ignore.html)

## Events

For events documentation, add a comment right above it. If your comment is at the start of the function, the event will not be picked up.

### In script block

If the event is explicitly specified, no need to tell styleguidist what it is.

```js
/**
 * Success event.
 */
this.$emit('success')
```

Constants will be recognized too

```js
/**
 * Success event.
 */
const success = 'succ'
this.$emit(success)
```

If your event name comes from an object, precise the `@event` tag

```js
/**
 * Success event.
 *
 * @event success
 */
this.$emit(EVENTS.success)
```

If your event returns arguments/properties use the `@property` tag to describe them

> Use `@arg` or `@param` if you prefer

```js
/**
 * Triggers when the number changes
 *
 * @property {number} newValue new value set
 * @property {number} oldValue value that was set before the change
 */
this.$emit('change', newValue, oldValue)
```

### In template

Events emitted directly in `v-on` expressions will be detected automatically. To document them further, in the template, add a comment above the line where the `$emit()` is called.

The comment block containing the documentation needs to contain one line with `@event click`. The rest of the comment block will behave like the comment blocks described in the script.

`@property` to describe an argument and no tag at all to set the description of the event.

```html
<div>
  <!--
    triggered on click
    @event click
    @property {object} demo - example
    @property {number} called - test called
  -->
  <button @click="$emit('click', test)"></button>
</div>
```

## Slots

Static slots are automatically documented by styleguidist.

### In the template

To add a description, add a comment right before.

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

In addition to documenting the slots and giving them a description, you can document the bindings. They are documented like props or params using the keyword `@binding`,

The format will then be

```html
<!--
  @binding {type} BindingName description of what the bindings is meant for
  -->
```

example of a real documented slot

```html
<div slot-scope="row" class="list-item1">
  {{row.item.text}}
  <!--
  	@slot Menu Item footer
		@binding {object} icon icon of the menu item
		@binding {string} text text of the menu item
	-->
  <slot name="test" :icon="row.item.icon" :text="row.item.text" />
</div>
```

> **Note:** The docblock must be part of the **same** comment block. Multiple individual comments do not get parsed together.

Another example of how to document bondings is in the `ScopedSlot` component in the basic example. Read the [code](https://github.com/vue-styleguidist/vue-styleguidist/blob/dev/examples/basic/src/components/ScopedSlot/ScopedSlot.vue) and see how it is rendered in the [live example](https://vue-styleguidist.github.io/basic/#scopedslot)

### In a render function

If your component is rendered using jsx, tsx or is using the render function styleguidist will still try to detect your slots.

Here are two examples that are detected and documented:

Detect a default slot

```js
export default {
  render(createElement) {
    return createElement('div', [
      /**
       * @slot The header
       * @binding {object} menuItem the menu item
       */
      this.$scopedSlots.default({
        menuItem: this.message
      })
    ])
  }
}
```

In a functional component:

```js
export default {
  functional: true,
  render: function (createElement, { data, children: cld }) {
    /* @slot describe destructured default */
    return createElement('div', data, cld)
  }
}
```

If vue-styleguidist does not detect your slots, you can explicitly tell it with a comment block before the render function:

```js
export default {
  /**
   * Place the content of your menuitem here,
   * the value of index and content will be passed down to you
   * @slot menuContent
   * @binding {number} index the index in the list
   * @binding {string} content text of the item
   */
  render: function () {
    // ...
  }
}
```

If you have multiple slots, place multiple blocks one after another:

```js
export default {
  /**
   * @slot content
   */
  /**
   * @slot icon
   */
  render: function () {
    // ...
  }
}
```

## Include Mixins and Extends

If you import a [mixin](https://vuejs.org/v2/guide/mixins.html) or [extends](https://vuejs.org/v2/api/#extends) it will automatically be added to your main component

## Usage examples and Readme files

Vue styleguidist will look for any `Readme.md` or `ComponentName.md` files in the component’s folder and display them. Any code block with a language tag of `vue`, `js`, `jsx`, `javascript` or `html` will be rendered as a Vue component with an interactive playground.

If you want to ignore the readme file for one component, use the `@example [none]` doclet. Use this when multiple components in the same folder share a `ReadMe` file. This will prevent the examples from being rendered multiple times.

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

> **Note:** You can configure examples file name with the [getExampleFilename](/Configuration.md#getexamplefilename) option.

You can also add the [custom block](https://vue-loader.vuejs.org/en/configurations/custom-blocks.html) `<docs></docs>` inside `*.vue` files, so that vue styleguidist builds the readme. You can review the following [example](https://github.com/vue-styleguidist/vue-styleguidist/blob/delivery/examples/basic/src/components/Radio/Radio.vue#L20)

### External examples using doclet tags

Additional example files can be associated with components using `@example` doclet syntax.

The following component will also have an example loaded from the `extra.examples.md` file:

```js
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

> **Note:** You’ll need a regular example file (like `Readme.md`) too when [skipComponentsWithoutExample](/Configuration.md#skipcomponentswithoutexample) is `true`.

### Ignore examples files

The `@examples` doclet can also be used to ignore the connected `ReadMe` file. Use it to avoid rendering examples multiple times.

```js
/**
 * Component is described here.
 *
 * @example [none]
 */
export default {
  name: 'Button'
  // ...
}
```

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

By default, all props your components have are considered to be public and are published. In some rare cases, you might want to remove a prop from the documentation while keeping it in the code. To do so, mark the prop with JSDoc [`@ignore`](http://usejsdoc.org/tags-ignore.html) tag to remove it from the docs:

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

### displayName

In addition to those tags, you can use `@displayName` to change the name displayed in your style guide. Know that since it's visual name has changed, it's calling name is now The letters of it, without space or punctuation.

For instance, if the display name is set as

```js
/**
 * @displayName Wonderful Button
 **/
```

To reference it in examples, one has to call `<WonderfulButton/>`. See to [How to use component name in docs with a different displayName](./Cookbook.md#how-to-use-component-name-in-docs-with-a-different-displayname)

## Methods

When documenting methods you can also use:

- [@param, @arg, @argument](http://usejsdoc.org/tags-param.html)

Documenting events:

- [@event](http://usejsdoc.org/tags-event.html)

Documenting v-model:

- @model

Tags can even render Markdown.

- [@public](http://usejsdoc.org/tags-public.html)

You can mark your public methods with JSDoc `@public` tag to get them published in the docs.

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
        type: Function,
        default: event => {
          console.log('You have clicked me!', event.target)
        }
      }
    },
    methods: {
      /**
       * Gets called when the user clicks on the button
       *
       * @param {SyntheticEvent} event The react `SyntheticEvent`
       * @param {Number} num Numbers of examples
       * @public This is a public method
       */
      launch(event, num) {
        /* ... */
      },
      // ...
      ignoreMethod() {
        /**
         * Success event.
         *
         * @event success
         * @type {object}
         */
        this.$emit('success', {})
      }
    }
    /* ... */
  }
</script>
```

## Composable Components

When a component is a list or a table it is easier to write it using a composition API.

For example, a dropdown element would be easier to read this way

```html
<DropDown>
  <Choice val="1">value 1</Choice>
  <Choice val="2">value 2</Choice>
</DropDown>
```

than with a prop

```html
<DropDown
  :choices="[{val:1,text:'value 1'}, {val:2,text:'value 2'}]"
/>
```

Here is how Vue Styleguidist helps document this pattern: Please add `@requires` doclets to the main component.

In the previous example we have a `DropDown` component that requires a `Choice` component to render properly. Here is how DropDown should look like.

```vue
<template>
  <select>
    <slot />
  </select>
</template>
<script>
/**
 * @requires ./Choice.vue
 */
export default {
  name: 'DropDown'
}
</script>
```

> **NOTE** Now `Choice` will be documented **only** as a part of `DropDown`. It will not have its own page or its own examples. Its props will be displayed with `DropDown`s, and it will be made available in `DropDown`s examples.

## TypeScript, Flow and Class-style Components

Vue Styleguidist understands TypeScript & Flow annotations. Write components in a typed language, types are documented automatically. It is compatible with class style components as well, with or without TypeScript.

```ts
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'ClassButton'
})
export default class MyComponent extends Vue {
  aHiddenData: string = ''

  /**
   * prop typed through the decorators arguments
   */
  @Prop({ type: String })
  propNoType = ''

  /**
   * prop typed through an annotation
   */
  @Prop() propA: number = 0

  /**
   * prop with a default value
   */
  @Prop({ default: 'default value' })
  propB: string = 'hello'

  /**
   * prop with a hybrid type
   */
  @Prop() propC: string | boolean = false

  /**
   * method testing
   * @public
   */
  onClick(a: string) {
    /**
     * Success event when we click
     */
    this.$emit('success', a)
  }
}
```

Notice how `onClick` parameter `a` does not need type documentation.

## JSX

vue styleguidist understands JSX component templates too. In this example, it will display the definition of the found slot.

```jsx
export default {
  render() {
    return (
      <div>
        {/** @slot Use this slot to have a header */}
        <slot name="header" />
        {this.contentText}
      </div>
    )
  }
}
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

You can also `import` other modules (e.g. mock data that you use in your unit tests) from examples in Markdown:

```jsx
const mockData = require('./mocks');
<Message :content="mockData.hello" />
```

> **Note:** If you need a more complex demo it’s often a good idea to define it in a separate JavaScript file and `import` it in Markdown. If the component file is in the same folder as the markdown, write `import { myExample as exam } from './myExample';` You can then use this imported setup object in your examples. Note that the code for the setup will not appear in the documentation.
>
> ```jsx
> import { myExample as Button } from './myExample';
> <div>
>   <Button />
> </div>
> ```

> **Note** If you prefer to use JSX in your examples, use the [jsxInExample](/Configuration.md#jsxInExamples) option in your `styleguide.config.js`. Using this option will force you to use proper Vue format for your examples. No more pseudo-JSX code.
>
> This would not work with the [jsxInExample](Configuration.md#jsxInExamples) option
>
> ```jsx
> <Button />
> ```
>
> ...while this would be valid
>
> ```jsx
> export default {
>   render() {
>     return <Button />
>   }
> }
> ```

## Importing examples

To make autocomplete and syntax highlighting practical, one can as well import examples from external files. In the following example `./myExample.vue` will be used as an example.

````markdown
```[import](./myExample.vue)
Text typed here will be entirely ignored. You can use it to describe the example imported for maintenance purposes
```
````

> **Note** This option DOES NOT replace automatically examples code with `vue-docgen-cli`. Since the rendering engine is only copying the contents of the markdown without parsing it, the CLI can't know what content to replace.

> **Note** No need to specify the language as it will be inferred from the name of the file

> **Note** All flags described [here](#usage-examples-and-readme-files) can still be used
