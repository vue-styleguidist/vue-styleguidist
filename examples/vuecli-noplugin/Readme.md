# vuecli3 test example for when people forgot to install the plugin

**Warning** Prefer using the plugin to this method as specified in the [documentation](https://vue-styleguidist.github.io/VueCLI3doc.html)

It works overall without HMR. If you do any changes while styleguidist is running you get [an HMR Loop](https://github.com/vue-styleguidist/vue-styleguidist/issues/290). This cannot be solved easily as the hmr plugin from the vue CLI bumps into the plugin from styleguidist.

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn run serve
```

### Compiles and minifies for production

```
yarn run build
```

### Lints and fixes files

```
yarn run lint
```
