# Getting Started with Vue Styleguidist

## 1. Install Styleguidist

1. Install Styleguidist and peer dependencies from npm:

   ```bash
   npm install --save-dev vue-styleguidist webpack
   ```

2. [Point Styleguidist to your Vue components](Components.md)

3. [Tell Styleguidist how to load your code](Webpack.md)

> **Note:** Webpack is a peer dependency but your project doesn’t have to use it. Styleguidist works with webpack 1 and webpack 2.

## 2. Add npm scripts for convenience (optional)

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "vue-styleguide": "vue-styleguidist server",
    "vue-styleguide:build": "vue-styleguidist build"
  }
}
```

## 3. Start your style guide

Run **`npm run vue-styleguide`** to start style a guide dev server.

Run **`npm run vue-styleguide:build`** to build a static version.

## 4. Start documenting your components

See how to [document your components](Documenting.md)

