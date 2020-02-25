# vue-docgen-api

`vue-docgen-api` turns VueJs components into documentation objects.

<!-- toc -->

- [API](#api)
- [Documentation Object](#documentation-object)
- [Parsers](#parsers)
- [Handlers](#handlers)

<!-- tocstop -->

## API

### Type `ComponentDoc`

Every parser in docgen-api returns an instannce of `ComponentDoc` or a `ComponentDoc[]`.

```ts
interface ComponentDoc {
  /**
   * Usual name of the component:
   *  It will take by order of priority
   *  - The contents of the @displayName tag of teh component
   *  - The name of the variable containing the comopnent (or the class if class component)
   *  - the name of the file containing the component
   */
  displayName: string

  /**
   * name of the export containing the component
   * In most cases `default`
   * If you export es6 named components you can find those names here
   */
  exportName: string

  /**
   * Contents of every line that is not conatined in a tag
   * in the code block before your component
   * @see below
   */
  description?: string
  /**
   * Array of `PropDescriptor` objects describing all props unless ignored via the @ignore tag
   */
  props?: PropDescriptor[]
  /**
   * Array of `MethodDescriptor` objects describing all methods declared public via the @public tag
   */
  methods?: MethodDescriptor[]
  /**
   * Array of `SlotDescriptor` objects describing all slots
   */
  slots?: SlotDescriptor[]
  /**
   * Array of `EventDescriptor` objects describing all event emitted by your components
   */
  events?: EventDescriptor[]
  /**
   * All tags applied to the component
   * @remark only component tags are stored here.
   * Prop, method and event tags are stored with the property they describe
   */
  tags?: { [key: string]: BlockTag[] }
  /**
   * When using SFC components, one can use `<docs>` blocks.
   * This is the content of the current docs block if it was found
   */
  docsBlocks?: string[]
  /**
   * Extra free data that user can set if they need (not used in the current standard)
   */
  [key: string]: any
}
```

### `parse(filePath:string, options?: DocGenOptions):ComponentDoc`

Parses the file at filePath. Returns and objects containing all documented and undocumented properties of the component.

```ts
import { parse } from 'vue-docgen-api'

var componentInfoSimple = parse(filePath)
```

In the options, specify the changes you made to node resolution through your Webpack config. Write additional script and template handlers and push them in the options object to parse non-standard elements.

```ts
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { parse, Documentation, ParseOptions } from 'vue-docgen-api'
import { ASTElement } from 'vue-template-compiler'

var componentInfoConfigured = parse(filePath, {
  alias: { '@assets': path.resolve(__dirname, 'src/assets') },
  resolve: [path.resolve(__dirname, 'src')],
  addScriptHandlers: [
    function(
      documentation: Documentation,
      componentDefinition: NodePath,
      astPath: bt.File,
      opt: ParseOptions
    ) {
      // handle custom code in script
    }
  ],
  addTemplateHandlers: [
    function(
      documentation: Documentation,
      templateAst: ASTElement,
      options: TemplateParserOptions
    ) {
      // handle custom directives here
    }
  ]
})
```

### `parseSource(code: string, filePath:string, options?: DocGenOptions):ComponentDoc`

Same as `parse`, but this way you can force the content of the code. The `filePath` parameter will then only be used for dependency resolution.

### `parseMulti(code: string, filePath:string, options?: DocGenOptions):ComponentDoc[]`

Same as `parse`, but allows for multiple exported components in one file.

**NOTE** Return type is `Array<ComponentDoc>` instead of `ComponentDoc`. Use `exportName` to differentiate the exports.

### options `DocGenOptions`

#### `alias`

This is a mirror to the [wepbpack alias](https://webpack.js.org/configuration/resolve/#resolvealias) options. If you are using [alias in Webpack](https://webpack.js.org/configuration/resolve/#resolvealias) or paths in TypeScript, you should reflect this here.

#### `resolve`

`resolve` mirrors the [webpack option](https://webpack.js.org/configuration/resolve/#resolve) too. If you have it in Webpack or use `baseDir` in TypeScript, you should probably see how this one works.

#### `addScriptHandler` and `addTemplateHandler`

The custom additional handlers allow you to add custom handlers to the parser. A handler can navigate and see custom objects that the standard parser would ignore.

#### `validExtends`

Function - Returns if an extended component should be parsed by docgen.

**NOTE** If docgen fails to parse the targetted component, it will log a warning. It is non-blocking but annoying.

**NOTE** If you allow all of `node_modules` to try to be parsed, you might degrade performance. Use it responsibly.

## Documentation Object

The `Documentation` class is the container of information before getting compiled. To be used and exported, use the `toObject()` function to make a neutral serializable object.

The object has functions to get descriptors for props, events, methods, and slots. All those functions follow the same principle. If you call it twice with the same argument, it will return twice the same reference to the prop. This way if your prop is decorated in multiple places, it simplifies its documentation.

```ts
function getPropDescriptor(propName: string): PropDescriptor
```

## Parsers

First, we use babel to parse the comments in the code.

Then we use `vue-template-compiler` to parse the HTML template.

These parsers give us Abstract Syntax Trees (AST). We then traverse them with handlers to extract the info we need from components and their JSdoc.

## Handlers

Script and template have 2 different AST structure. It makes sense that they have different handlers. There are a few standard handlers in docgen. You can add your own using the `addScriptHandler` or `addTemplateHandler` options.

### Script Handlers

To handle scripts, we can register them this way. Each handler is a JavaScript function following this prototype.

```ts
export default function handler(
  documentation: Documentation,
  componentDefinition: NodePath,
  astPath: bt.File,
  opt: ParseOptions
) {
  // Handling of the documentation on the script
}
```

In the example next, we extract the functional flag of a Vue component object.

```ts
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { Documentation, ParseOptions } from 'vue-docgen-api'

export default function handler(
  documentation: Documentation,
  componentDefinition: NodePath,
  astPath: bt.File,
  opt: ParseOptions
) {
  // deal with functional flag
  if (bt.isObjectExpression(componentDefinition.node)) {
    const functionalPath = componentDefinition
      .get('properties')
      .filter(
        (p: NodePath) =>
          bt.isObjectProperty(p.node) &&
          p.node.key.name === 'functional'
      )

    if (functionalPath.length) {
      const functionalValue = functionalPath[0].get('value').node
      if (bt.isBooleanLiteral(functionalValue)) {
        documentation.set('functional', functionalValue.value)
      }
    }
  }
  // ...
}
```

### Template Handlers

Template handlers have the following prototype.

```ts
export default function handler(
  documentation: Documentation,
  templateAst: ASTElement,
  options: TemplateParserOptions
) {
  // template handler code
}
```

The following example stores all buttons name attributes in the template in a `buttons` key.

```ts
import { ASTElement } from 'vue-template-compiler'
import { Documentation, TemplateParserOptions } from 'vue-docgen-api'

export default function slotHandler(
  documentation: Documentation,
  templateAst: ASTElement,
  options: TemplateParserOptions
) {
  if (templateAst.tag === 'button') {
    let buttons = documentation.get('buttons') || []
    buttons.push(templateAst.attrsMap['name'])
    documentation.set('buttons', buttons)
  }
}
```
