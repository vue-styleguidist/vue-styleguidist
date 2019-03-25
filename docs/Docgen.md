# vue-docgen-api

`vue-docgen-api` turns VueJs component into documentation.

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
import { parse } from 'vue-docgen-api'
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

Same as parse, but this way you can force the content of the code. The filePath parameter will then only be used for dependency resolution.

## Documentation Object

## Parsing

## Handlers
