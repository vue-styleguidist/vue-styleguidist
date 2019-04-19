# Use with the cli 3

With the coming of the new cli 3 devs can create a working environment in minutes. Just do `vue create myProject` and you are read to code vue stuff.

The vue environment created packs its own set of features. If you want to add styleguidist to the mix and document the components you create in @vue/cli just do

```sh
vue add styleguidist
```

Vue Styleguidist will configure itself and add a couple examples to get you started. It will immediately set up the webpack config the hmr and a nice styleguide for you to use. You can still modify the `styleguide.config.js` to make the styleguide look even better.

/!\ NOTA /!\ If you wish to use styleguidist with the CLI but without the plugin, you might have to remove the HMR from the CLI itself. If you do not it might just end up on an infinite HMR loop like in [issue 290](https://github.com/vue-styleguidist/vue-styleguidist/issues/290)
