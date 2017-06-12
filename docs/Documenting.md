# Documenting components

Styleguidist generates documentation for your components based on the comments in your source code and Readme files.

> **Note:** [See examples](https://github.com/vue-styleguidist/vue-styleguidist/tree/master/examples/basic/src/components) of documented components in our demo style guide.

## Code comments

Styleguidist will display your components’ JSDoc comment blocks.

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

> **Note:** You can change its behavior using [propsParser](Configuration.md#propsparser) options.

> **Note:** Component’s and documentation comments are parsed by the [vue-docgen-api](https://github.com/vue-styleguidist/vue-docgen-api) library.

## Usage examples and Readme files

Styleguidist will look for any `Readme.md` or `ComponentName.md` files in the component’s folder and display them. Any code block without a language tag will be rendered as a  Vue component with live editable preview.

    Vue component example:

        <Button size="large">Push Me</Button>

    One more with generic code fence:

    ```
    <Button size="large">Push Me</Button>
    ```

    One more with `example` code fence (text editors may alias to `jsx` or `javascript`):

    ```example
    <Button size="large">Push Me</Button>
    ```

    This example is rendered only as highlighted source code, not an actual component:

    ```html
    <Button size="large">Push Me</Button>
    ```

    Any [Markdown](http://daringfireball.net/projects/markdown/) is **allowed** _here_.

> **Note:** You can configure examples file name with the [getExampleFilename](Configuration.md#getexamplefilename) option.

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
  name: 'Button',
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
MyComponent.propTypes = {
  /**
   * A prop that should not be visible in the documentation.
   *
   * @ignore
   */
  hiddenProp: React.PropTypes.string
}
```

## Using JSDoc tags

You can use the following [JSDoc](http://usejsdoc.org/) tags when documenting components, props and methods:

- [@deprecated](http://usejsdoc.org/tags-deprecated.html)
- [@see, @link](http://usejsdoc.org/tags-see.html)
- [@author](http://usejsdoc.org/tags-author.html)
- [@since](http://usejsdoc.org/tags-since.html)
- [@version](http://usejsdoc.org/tags-version.html)

When documenting props you can also use:

- [@param, @arg, @argument](http://usejsdoc.org/tags-param.html)

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
    }
  },
  /* ... */
}
</script>
```
