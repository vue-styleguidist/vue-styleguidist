# Locating your components and organizing your style guide

<!-- To update run: npx markdown-toc --maxdepth 2 -i docs/Components.md -->

<!-- toc -->

- [Finding components](#finding-components)
- [Sections](#sections)
- [Limitations](#limitations)

<!-- tocstop -->

## Finding components

By default Styleguidist will search components using this [glob pattern](https://github.com/isaacs/node-glob#glob-primer): `src/components/**/*.vue`.

For example, if your components look like `components/Button/Button.vue`:

```javascript
module.exports = {
  components: 'src/components/**/[A-Z]*.vue'
}
```

But will ignore tests:

- `__tests__` folder

> **Note:** All paths are relative to the config folder.

> **Note:** Use [ignore](Configuration.md#ignore) option to exclude some files from the style guide.

> **Note:** Use [getComponentPathLine](Configuration.md#getcomponentpathline) option to change a path you see below a component name.

## Loading and exposing components

Styleguidist _loads_ your components and _exposes_ them globally for your examples to consume.

## Sections

Group components into sections or add extra Markdown documents to your style guide.

Each section consists of (all fields are optional):

- `name` — section title.
- `content` — location of a Markdown file containing the overview content.
- `components` — a glob pattern string, an array of component paths or glob pattern strings, or a function returning a list of components or glob pattern strings. The same rules apply as for the root `components` option.
- `sections` — array of subsections (can be nested).
- `description` — A small description of this section.
- `sectionDepth` — Number of subsections with single pages, only available with [pagePerSection](Configuration.md#pagepersection) is enabled.
- `exampleMode` — Initial state of the code example tab, uses [exampleMode](Configuration.md#examplemode).
- `usageMode` — Initial state of the props and methods tab, uses [usageMode](Configuration.md#usagemode).
- `ignore` — string/array of globs that should not be included in the section.
- `href` - an URL to navigate to instead of navigating to the section content
- `external` - if set, the link will open in a new window

Configuring a style guide with textual documentation section and a list of components would look like:

```javascript
module.exports = {
  sections: [
    {
      name: 'Introduction',
      content: 'docs/introduction.md'
    },
    {
      name: 'Documentation',
      sections: [
        {
          name: 'Installation',
          content: 'docs/installation.md',
          description: 'The description for the installation section'
        },
        {
          name: 'Configuration',
          content: 'docs/configuration.md'
        },
        {
          name: 'Live Demo',
          external: true,
          href: 'http://example.com'
        }
      ]
    },
    {
      name: 'UI Components',
      content: 'docs/ui.md',
      components: 'lib/components/ui/*.vue'
    }
  ]
}
```
