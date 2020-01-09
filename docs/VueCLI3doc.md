# Use with the cli 3

With Vue CLI 3, developers can now create a working environment in minutes. Use `vue create myProject` and you are ready to code VueJs. Better, it can help you get started with styleguidist.

## Install

To add `styleguidist` to the mix set a terminal in your app's directory and type

```sh
vue add styleguidist
```

Vue Styleguidist will configure itself and add a couple examples to get you started. It will immediately set up the webpack config, Hot Module Reloading and a sample styleguide for you to browse. You can modify the `styleguide.config.js` to make the styleguide look like what's needed.

> **Note** If you wish to use `styleguidist` with the CLI but without the plugin, it is not impossible. Install `styleguidist` normally. It is not officially supported though.
>
> You might have to remove the HMR from the CLI yourself as it conflicts with styleguidists HMR. You might end up on an infinite HMR loop. See [issue 290](https://github.com/vue-styleguidist/vue-styleguidist/issues/290)

## Vue UI

Vue Styleguidist is compatible with the Vue UI so if you want to configure `styleguidist` through a graphical interface, open a console and run the following command.

```sh
vue ui
```

In the plugins configuration, you will find switches to configure your styleguide.
