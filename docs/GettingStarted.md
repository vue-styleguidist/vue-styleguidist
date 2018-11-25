# Getting Started with Vue Styleguidist

## 1. Install Styleguidist

Install webpack if you don’t have it already:

```bash
npm install --save-dev webpack
```

Install Styleguidist:

```bash
npm install --save-dev vue-styleguidist
```

## 2. Configure your style guide

If you’re using [Vue-CLI 3.x](https://github.com/vuejs/vue-cli) you can skip this step, and install [vue-cli-plugin-styleguidist](https://github.com/vue-styleguidist/vue-cli-plugin-styleguidist).

[Point Styleguidist to your Vue components](Components.md) and [tell how to load your code](Webpack.md).

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
