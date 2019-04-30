# Getting Started

## 1. Install

Install webpack if you don’t have it already, this is how we determine if your version of webpack is compatible with styleguidist.

```bash
npm install --save-dev webpack
```

Install Styleguidist:

```bash
npm install --save-dev vue-styleguidist
```

If you use Vue CLI 3 ([@vue/cli](https://cli.vuejs.org/)), you should probably use the plugin

```sh
vue add styleguidist
```

and use [Vue CLI documentation](/VueCLI3doc.md)

## 2. Configure your style guide

[Point Styleguidist to your Vue components](Components.md) and [tell it how to load your code](Webpack.md).

If you’re using [Vue-CLI 3](https://github.com/vuejs/vue-cli) you can skip the webpack step. When you install [vue-cli-plugin-styleguidist](/VueCLI3doc.md), styleguidist picks up what it needs from the CLI. Just tell it where to find the components

## 3. Add npm scripts for convenience

Add these scripts to your `package.json`:

```diff
{
  "scripts": {
+    "styleguide": "vue-styleguidist server",
+    "styleguide:build": "vue-styleguidist build"
  }
}
```

## 4. Start your style guide

Run **`npm run styleguide`** to start style a guide dev server.

Run **`npm run styleguide:build`** to build a static version.

## 5. Start documenting your components

See how to [document your components](Documenting.md)

## Have questions?

- [Read the cookbook](Cookbook.md)
