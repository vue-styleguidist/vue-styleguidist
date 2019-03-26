# vue-docgen-api

`vue-docgen-api` turns VueJs components into documentation objects.

<!-- To update run: npx markdown-toc --maxdepth 2 -i docs/Docgen.md -->

<!-- toc -->

- [API](#api)
- [Documentation Object](#documentation-object)
- [Parsers](#parsers)
- [Handlers](#handlers)

<!-- tocstop -->

## API

The package exposes 2 functions:

### `parse(filePath:string, options?: DocGenOptions)`

Parses the file at filePath. Returns and object containing all documented and undocumented properties of the component.

```ts
import { parse } from 'vue-docgen-api'

var componentInfoSimple = parse(filePath)
```

In the options, specify the changes you made to node resolution through your webpack config. Write additional script and template handlers and push them in the options object to parse non-standard elements.

```ts
import * as bt from '@babel/types'
import { NodePath } from 'ast-types'
import { parse, Documentation, ParseOptions } from 'vue-docgen-api'
import { ASTElement } from 'vue-template-compiler'

var componentInfoConfigured = parse(filePath, {
  alias: { '@assets': path.resolve(__dirname, 'src/assets') },
  resolve: [path.resolve(__dirname, 'src')],
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
  ]
})
```

### `parseSource(code: string, filePath:string, options?: DocGenOptions)`

Same as parse, but this way you can force the content of the code. The `filePath` parameter will then only be used for dependency resolution.

## Documentation Object

The `Documentation` class is the container of information before geting compiled. It is easily modified and accessed. In order to be used and exported, one can use the `toObject()` function.

The object has functions to get descriptor for props, events, methods and slots. All those functions follow the same principle. If you call it twice with the same argument, it will return twice the same reference to the prop. this way if your prop is decorated in multiple places, it can be easily made working.

```ts
function getPropDescriptor(propName: string): PropDescriptor
```

## Parsing

First we use babel to parse the comments in the code.

Then we use vue-template-compiler to parse the html template.

These parsers give us Abstract Syntax Trees (AST). We then traverse them with handlers to extract the info we need from components and their JSdoc.

## Handlers

Script and template have 2 different AST structure. Makes sense that they have different handlers. There is a few standard handlers in docgen. You can add your own using the `addScriptHandler` or `addTemplateHandler` options.

### Script Handlers

To handle scripts, we can registrer them this way. Each handler is a JavaScript function following this prototype.

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
