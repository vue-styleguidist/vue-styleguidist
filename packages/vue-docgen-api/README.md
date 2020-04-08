# vue-docgen-api

[Online Documentation](https://vue-styleguidist.github.io/docs/Docgen.html)

`vue-docgen-api` is a toolbox to help extracting information from [Vue](https://vuejs.org/) components, and generate documentation from it.

Use [@babel/parser](https://babeljs.io/docs/en/babel-parser) to parse the code and analyze the contents of the component extracting methods, props events and slots. The output is a JavaScript object.

## Install

Install the module directly from npm:

```sh
npm install vue-docgen-api --save-dev
```

## API

The tool can be used programmatically to extract component information and customize the extraction process:

```js
var vueDocs = require('vue-docgen-api')
var componentInfo
vueDocs.parse(filePath).then(ci => {
  componentInfo = ci
})
```

or with typescript

```ts
import { parse } from 'vue-docgen-api'

async function parseMyComponent(filePath: string) {
  var componentInfoSimple = await parse(filePath)
  var componentInfoConfigured = await parse(filePath, {
    alias: { '@assets': path.resolve(__dirname, 'src/assets') },
    modules: [path.resolve(__dirname, 'src')],
    addScriptHandler: [
      function(
        documentation: Documentation,
        componentDefinition: NodePath,
        astPath: bt.File,
        opt: ParseOptions
      ) {
        // handle custom code in script
      }
    ],
    addTemplateHandler: [
      function(
        documentation: Documentation,
        templateAst: ASTElement,
        options: TemplateParserOptions
      ) {
        // handle custom directives here
      }
    ],
    preScriptHandlers: [
      function(
        documentation: Documentation,
        componentDefinition: NodePath,
        astPath: bt.File,
        opt: ParseOptions
      ) {
        // replaces handlers run before the scriptHandlers
      }
    ],
    scriptHandlers: [
      function(
        documentation: Documentation,
        componentDefinition: NodePath,
        astPath: bt.File,
        opt: ParseOptions
      ) {
        // replaces all the scriptHandlers
      }
    ],
    templateHandlers: [
      function(
        documentation: Documentation,
        templateAst: ASTElement,
        options: TemplateParserOptions
      ) {
        // replaces all the templateHandlers
      }
    ],
    validExtends: (fullFilePath: string) =>
      /[\\/]@my-component-library[\\/]/.test(fullFilePath) ||
      !/[\\/]node_modules[\\/]/.test(fullFilePath)
    jsx: true,
    nameFilter: ['MyComponent']
  })
}
```

### `parse()` vs `parseMulti()`

The API exports two asynchronous functions `parse` and `parseMulti`. The two functions take the same set of parameters. `parse` returns a pure `ComponentDoc` whereas `parseMulti` returns an array of `ComponentDoc`

When using only SFC or components that are the only one in their components, this function returns a `ComponentDoc` object. Using `parse` in most cases is simpler.

If you are creating a library and your goal is to have it as generic as possible, it might be a good idea to use `parseMulti`. In some cases, developer choose to have **more than one component** exported by a file, which make `parse` throw an error.

### Prototypes

```ts
parse(filePath: string, options: DocGenOptions): Promise<ComponentDoc>;
parseSource(source: string, filePath: string, opts?: DocGenOptions): Promise<ComponentDoc>;
parseMulti(filePath: string, options: DocGenOptions): Promise<ComponentDoc[]>;
```

### options `DocGenOptions`

#### `alias`

This is a mirror to the [wepbpack alias](https://webpack.js.org/configuration/resolve/#resolvealias) options. If you are using [alias in Webpack](https://webpack.js.org/configuration/resolve/#resolvealias) or paths in TypeScript, you should reflect this here..

#### `modules`

`modules` mirrors the [webpack option](https://webpack.js.org/configuration/resolve/#resolvemodules) too. If you have it in webpack or use `baseDir` in your tsconfig.json, you should probably see how this one works.

#### `addScriptHandler` and `addTemplateHandler`

The custom additional handlers allow you to add custom handlers to the parser. A handler can navigate and see custom objects that the standard parser would ignore.

#### `preScriptHandlers`, `scriptHandlers` and `templateHandlers`

Replaces all of the handlers by those specified. If each of those 3 `handlers` are set to [], the library will only parse the given component. It will not run any standard handlers anymore.

> **NOTE** Standard handlers are available as namespaces. Import and use them this way:
>
> ```js
> import {
>   parse,
>   ScriptHandlers,
>   TemplateHandlers
> } from 'vue-docgen-api'
>
> parse('myComp', {
>   scriptHandlers: [ScriptHandlers.componentHandler],
>   templateHandlers: [TemplateHandlers.slotHandler]
> })
> ```

#### `validExtend`

Function - Returns if an extended component should be parsed by docgen.

**NOTE** If docgen fails to parse the targetted component, it will log a warning. It is non-blocking but annoying.

**NOTE** If you allow all of `node_modules` to try to be parsed, you might kill performance. Use responsibly.

#### `jsx`

Does your component contain JSX? By default, this is set to false to avoid conflicts with the <> syntax from TypeScript.

If it does, set this flag to true.

#### `nameFilter`

If a file exports multiple components and you only want one, use this option to filter the named exports.

It is noticeably useful when browsing through extended components and mixins. If left blank (undefined), will look at all exports

## Using JSDoc tags

You can use JSDoc tags when documenting components, props and methods.

## Props

```js
export default {
  props: {
    /**
     * Color of the button.
     */
    color: {
      type: String,
      default: '#FCC'
    },
    /**
     * initial value to be passed but undocumented
     * @ignore
     */
    initialvalue: {
      type: Number,
      default: 0
    },
    /**
     * The size of the button allows only some values
     * @values small, medium, large
     */
    size: {
      default: 'normal'
    }
  }
}
```

## Events

```js
export default {
  methods: {
    emitSuccess() {
      /**
       * Success event.
       *
       * @event success
       * @property {string} content content of the first prop passed to the event
       * @property {object} example the demo example
       */
      this.$emit('success', content, {
        demo: 'example'
      })
    }
  }
}
```

## Slots

```html
<template>
  <div>
    <!-- @slot Use this slot header -->
    <slot name="header"></slot>

    <!--
      @slot Modal footer
      @binding item an item passed to the footer
		-->
    <slot name="footer" :item="item" />
  </div>
</template>
```

## Full Example

For the following component

```vue
<template>
  <div>
    <!-- @slot Use this slot header -->
    <slot name="header"></slot>

    <table class="grid">
      <!-- -->
    </table>

    <!--
      @slot Modal footer
      @binding item an item passed to the footer
		-->
    <slot name="footer" :item="item" />
  </div>
</template>

<script>
import { text } from './utils'

/**
 * This is an example of creating a reusable grid component and using it with external data.
 * @version 1.0.5
 * @author [Rafael](https://github.com/rafaesc92)
 * @since Version 1.0.1
 */
export default {
  name: 'grid',
  props: {
    /**
     * object/array defaults should be returned from a factory function
     * @version 1.0.5
     * @since Version 1.0.1
     * @see See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names
     * @link See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names
     */
    msg: {
      type: [String, Number],
      default: text
    },
    /**
     * Model example
     * @model
     */
    value: {
      type: String
    },
    /**
     * describe data
     * @version 1.0.5
     */
    data: [Array],
    /**
     * get columns list
     */
    columns: [Array],
    /**
     * filter key
     * @ignore
     */
    filterKey: {
      type: String,
      default: 'example'
    }
  },
  data() {
    var sortOrders = {}
    this.columns.forEach(function(key) {
      sortOrders[key] = 1
    })
    return {
      sortKey: '',
      sortOrders: sortOrders
    }
  },
  computed: {
    filteredData: function() {
      var sortKey = this.sortKey
      var filterKey = this.filterKey && this.filterKey.toLowerCase()
      var order = this.sortOrders[sortKey] || 1
      var data = this.data
      if (filterKey) {
        data = data.filter(function(row) {
          return Object.keys(row).some(function(key) {
            return (
              String(row[key])
                .toLowerCase()
                .indexOf(filterKey) > -1
            )
          })
        })
      }
      if (sortKey) {
        data = data.slice().sort(function(a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return data
    }
  },
  filters: {
    capitalize: function(str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    /**
     * Sets the order
     *
     * @public
     * @version 1.0.5
     * @since Version 1.0.1
     * @param {string} key Key to order
     * @returns {string} Test
     */
    sortBy: function(key) {
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1

      /**
       * Success event.
       *
       * @event success
       * @type {object}
       */
      this.$emit('success', {
        demo: 'example'
      })
    },

    hiddenMethod: function() {}
  }
}
</script>
```

we are getting this output:

```js
const componentDoc = {
  displayName: 'grid',
  description:
    'This is an example of creating a reusable grid component and using it with external data.',
  tags: {
    version: [
      {
        description: '1.0.5',
        title: 'version'
      }
    ],
    author: [
      {
        description: '[Rafael](https://github.com/rafaesc92)',
        title: 'author'
      }
    ],
    since: [
      {
        description: 'Version 1.0.1',
        title: 'since'
      }
    ]
  },
  exportName: 'default',
  props: [
    {
      description:
        'object/array defaults should be returned from a factory function',
      tags: {
        version: [
          {
            description: '1.0.5',
            title: 'version'
          }
        ],
        since: [
          {
            description: 'Version 1.0.1',
            title: 'since'
          }
        ],
        see: [
          {
            description:
              'See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names',
            title: 'see'
          }
        ],
        link: [
          {
            description:
              'See [Wikipedia](https://en.wikipedia.org/wiki/Web_colors#HTML_color_names) for a list of color names',
            title: 'link'
          }
        ]
      },
      name: 'msg',
      type: {
        name: 'string|number'
      },
      defaultValue: {
        func: false,
        value: 'text'
      }
    },
    {
      description: 'Model example',
      tags: {
        model: [
          {
            description: true,
            title: 'model'
          }
        ]
      },
      name: 'v-model',
      type: {
        name: 'string'
      }
    },
    {
      description: 'describe data',
      tags: {
        version: [
          {
            description: '1.0.5',
            title: 'version'
          }
        ]
      },
      name: 'data',
      type: {
        name: 'array'
      }
    },
    {
      description: 'get columns list',
      tags: {},
      name: 'columns',
      type: {
        name: 'array'
      }
    },
    {
      description: 'filter key',
      tags: {
        ignore: [
          {
            description: true,
            title: 'ignore'
          }
        ]
      },
      name: 'filterKey',
      type: {
        name: 'string'
      },
      defaultValue: {
        func: false,
        value: "'example'"
      }
    }
  ],
  events: [
    {
      name: 'success',
      description: 'Success event.',
      type: {
        names: ['object']
      }
    }
  ],
  methods: [
    {
      name: 'sortBy',
      modifiers: [],
      description: 'Sets the order',
      tags: {
        access: [
          {
            description: 'public',
            title: 'access'
          }
        ],
        version: [
          {
            description: '1.0.5',
            title: 'version'
          }
        ],
        since: [
          {
            description: 'Version 1.0.1',
            title: 'since'
          }
        ],
        params: [
          {
            title: 'param',
            type: {
              name: 'string'
            },
            name: 'key',
            description: 'Key to order'
          }
        ],
        returns: [
          {
            title: 'returns',
            type: {
              name: 'string'
            },
            description: 'Test'
          }
        ]
      },
      params: [
        {
          name: 'key',
          type: {
            name: 'string'
          },
          description: 'Key to order'
        }
      ],
      returns: {
        title: 'returns',
        type: {
          name: 'string'
        },
        description: 'Test'
      }
    }
  ],
  slots: [
    {
      name: 'header',
      description: 'Use this slot header'
    },
    {
      name: 'footer',
      description: 'Modal footer',
      scoped: true,
      bindings: [
        {
          title: 'binding',
          type: {
            name: 'mixed'
          },
          name: 'item',
          description: 'an item passed to the footer'
        }
      ]
    }
  ]
}
```

## Change log

The change log can be found on the [Changelog Page](./CHANGELOG.md).

## Authors and license

[Rafael Escala](https://github.com/rafaesc92)

[Bart Ledoux](https://github.com/elevatebart)

MIT License.
