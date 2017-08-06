# Locating your components and organizing your style guide

## Components

By default Styleguidist will search components using this [glob pattern](https://github.com/isaacs/node-glob#glob-primer): `src/components/**/*.vue`. It will pick up paths like `src/components/Button.vue`. It will also ignore test files (`__tests__` folder and file names containing `.test.js` and `.spec.js`). If it doesn’t work for you, create a `styleguide.config.js` file in your project’s root folder and configure the patterns to fit your project structure.

For example, if your components look like `components/Button/Button.vue`:

```javascript
module.exports = {
  components: 'src/components/**/[A-Z]*.vue'
};
```

> **Note:** All paths are relative to the config folder.

> **Note:** Use [ignore](Configuration.md#ignore) option to exclude some files from the style guide.

> **Note:** Use [getComponentPathLine](Configuration.md#getcomponentpathline) option to change a path you see below a component name.

## Sections

Group components into sections or add extra Markdown documents to your style guide.

Each section consists of (all fields are optional):

- `name` — section title.
- `content` — location of a Markdown file containing the overview content.
- `components` — a glob pattern string or a function returning a list of components. The same rules apply as for the root `components` option.
- `sections` — array of subsections (can be nested).

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
          content: 'docs/installation.md'
        },
        {
          name: 'Configuration',
          content: 'docs/configuration.md'
        }
      ]
    },
    {
      name: 'UI Components',
      content: 'docs/ui.md',
      components: 'lib/components/ui/*.vue'
    }
  ]
};
```
