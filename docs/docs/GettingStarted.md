# Getting Started

## 1. Install

Install Webpack if you don’t have it already, this is how we determine if your version of Webpack is compatible with styleguidist.

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

Create a `styleguide.config.js` file in the same directory that your `package.json`. This will be your configuration file. In this file, you can :

- [Point Styleguidist to your Vue components](Components.md) and
- [Tell it how to load your code](Webpack.md)

If you’re using [Vue-CLI 3](https://github.com/vuejs/vue-cli) you can skip the webpack step. When you install [vue-cli-plugin-styleguidist](/VueCLI3doc.md), styleguidist picks up what it needs from the CLI. Then tell it where to find the components

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

## Have questions

- [Read the cookbook](Cookbook.md)
- [Ask on discord](https://discordapp.com/channels/325477692906536972/538786416092512278)
- [Post Questions on Github](https://github.com/vue-styleguidist/vue-styleguidist/issues/new?template=Question.md)
