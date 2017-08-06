# Getting Started with Vue Styleguidist

## 1. Install Styleguidist

1. Install Styleguidist and peer dependencies from npm:

   ```bash
   npm install --save-dev vue-styleguidist webpack
   ```

2. [Point Styleguidist to your Vue components](Components.md)

3. [Tell Styleguidist how to load your code](Webpack.md)

## 2. Add npm scripts for convenience (optional)

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "styleguide": "vue-styleguidist server",
    "styleguide:build": "vue-styleguidist build"
  }
}
```

## 3. Start your style guide

Run **`npm run styleguide`** to start style a guide dev server.

Run **`npm run styleguide:build`** to build a static version.

## 4. Start documenting your components

See how to [document your components](Documenting.md)

## Have questions?

* [Read the cookbook](Cookbook.md)
