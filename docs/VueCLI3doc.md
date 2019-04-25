# Use with the cli 3

With vue cli 3 devs can create a working environment in minutes. Just do `vue create myProject` and you are ready to code VueJs.

## Install

The vue environment created comes with its own set of features. If you want to add `styleguidist` to the mix just do

```sh
vue add styleguidist
```

Vue Styleguidist will configure itself and add a couple examples to get you started. It will immediately set up the webpack config, Hot Module Reloading and a nice styleguide for you to use. You can still modify the `styleguide.config.js` to make the styleguide look even better.

> **Note** If you wish to use `styleguidist` with the CLI but without the plugin, it is possible. Just install `styleguidist` normally.
>
> You might have to remove the HMR from the CLI yourself as it conflicts with styleguidists HMR. You might just end up on an infinite HMR loop. See [issue 290](https://github.com/vue-styleguidist/vue-styleguidist/issues/290)

## Vue UI

Vue Styleguidist is compatible with the Vue UI so if you want to configure `styleguidist` through a graphical interface, open a console and run the following command.

```sh
vue ui
```
