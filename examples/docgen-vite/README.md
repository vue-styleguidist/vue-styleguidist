# vue-example-docgen-vite

This template should help get you started developing with docgen and VitePress.

It contains an example of a light integration with vue-live in [docs/.vitepress/theme](./docs/.vitepress/theme).
Using a [markdown-it plugin](./docs/.vitepress/vue-live-md-it.mjs), we will render each example with the suffix `live` into a vue-live component.

It also uses `vue-component-meta` instead of `vue-docgen-api` to parse vue components for props and events.
The integration is done here: [docgen.config.js](./docgen.config.js)

### Run both vitepress & docgen at the same time

```sh
yarn styleguide
```

### chain the steps

```sh
yarn styleguide:build
```

## Project Setup

```sh
yarn
```

### Compile and Hot-Reload for Development

```sh
yarn dev
```

### Type-Check, Compile and Minify for Production

```sh
yarn build
```

### Generate the documentation pages for each component

```sh
yarn vue-docgen
```

### Open vitepress in the browser

```sh
yarn vitepress open
```
