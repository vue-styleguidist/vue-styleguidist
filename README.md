<div align="center" markdown="1" style="text-align:center">
    <img src="https://raw.githubusercontent.com/vue-styleguidist/vue-styleguidist/dev/assets/logo-withtext.png" alt="Vue Styleguidist" width="400">

**Isolated Vue component development environment with a living style guide**

<div>
<a href="https://travis-ci.com/vue-styleguidist/vue-styleguidist">
    <img src="https://travis-ci.com/vue-styleguidist/vue-styleguidist.svg?branch=dev" alt="Travis CI (unit & lint)">
</a>
<a href="https://circleci.com/gh/vue-styleguidist/vue-styleguidist">
    <img src="https://circleci.com/gh/vue-styleguidist/vue-styleguidist.svg?style=svg" alt="Circle CI (integration)">
</a>
<a href="https://codecov.io/gh/vue-styleguidist/vue-styleguidist">
  <img src="https://codecov.io/gh/vue-styleguidist/vue-styleguidist/branch/dev/graph/badge.svg" />
</a>
<a href="LICENSE">
    <img src="https://img.shields.io/npm/l/vue-styleguidist.svg" alt="License">
</a>
<a href="https://lernajs.io/">
    <img src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg" alt="Lerna">
</a>
<a href="https://discordapp.com/channels/325477692906536972/538786416092512278">
    <img src="https://img.shields.io/discord/325477692906536972.svg?logo=discord"
alt="Chat on Discord">
</a>
</div>
</div>

## Packages

[vue-styleguidist](packages/vue-styleguidist) takes the results of [vue-docgen-api](packages/vue-docgen-api) and creates a website to showcase and develop components.

[![](https://img.shields.io/npm/v/vue-styleguidist.svg)](https://www.npmjs.com/package/vue-styleguidist) [![](https://img.shields.io/npm/dm/vue-styleguidist.svg)](https://www.npmjs.com/package/vue-styleguidist)

---

[vue-docgen-api](packages/vue-docgen-api) parses vue components and load their documentation in a JavaScript object.

[![](https://img.shields.io/npm/v/vue-docgen-api.svg)](https://www.npmjs.com/package/vue-docgen-api) [![](https://img.shields.io/npm/dm/vue-docgen-api.svg)](https://www.npmjs.com/package/vue-docgen-api)

---

[vue-inbrowser-compiler](packages/vue-inbrowser-compiler) takes vue components code written in es6 and uses buble to make it compatible with all browser.

[![](https://img.shields.io/npm/v/vue-inbrowser-compiler.svg)](https://www.npmjs.com/package/vue-inbrowser-compiler) [![](https://img.shields.io/npm/dm/vue-inbrowser-compiler.svg)](https://www.npmjs.com/package/vue-inbrowser-compiler)

---

[vue-cli-plugin-styleguidist](packages/vue-cli-plugin-styleguidist) configures vue-styleguidist to work with [vue-cli 3](https://cli.vuejs.org/guide/).

[![](https://img.shields.io/npm/v/vue-cli-plugin-styleguidist.svg)](https://www.npmjs.com/package/vue-cli-plugin-styleguidist) [![](https://img.shields.io/npm/dm/vue-cli-plugin-styleguidist.svg)](https://www.npmjs.com/package/vue-cli-plugin-styleguidist)

---

[vue-docgen-cli](packages/vue-docgen-cli) is a command line interface generating documentation files automatically from [vue-dogen-api]. Generate markdown by default but can be configured to generate whatever text format you desire.

[![](https://img.shields.io/npm/v/vue-docgen-cli.svg)](https://www.npmjs.com/package/vue-docgen-cli) [![](https://img.shields.io/npm/dm/vue-docgen-cli.svg)](https://www.npmjs.com/package/vue-docgen-cli)

## Documentation

Docs are available at https://vue-styleguidist.github.io/ - we are still working on refining it and contributions are welcome!

## Contributing

Please see [contributing guide](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/.github/CONTRIBUTING.md).

Note that the current monorepo relies on `yarn` workspaces. Don't forget to install yarn, `npm i --global yarn`, before cloning.

## Authors and license

[Artem Sapegin](http://sapegin.me), [Rafael Escala](https://github.com/rafaesc), [Bart Ledoux](https://github.com/elevatebart), [react-styleguidist contributors](https://github.com/styleguidist/react-styleguidist/graphs/contributors) and [vue-styleguidist contributors](https://github.com/vue-styleguidist/vue-styleguidist/graphs/contributors). Thanks to the team of react-styleguidist for the amazing tool.

We work on this project because we love the open source community and learn new things.

- Rafael: You can buy me a cup of coffee :) [![Paypal.me donate](https://img.shields.io/badge/Paypal.me-donate-yellow.svg)](https://www.paypal.me/rafaesc)
- Bart: Help me get to conferences ;) [![Paypal.me donate](https://img.shields.io/badge/Paypal.me-donate-yellow.svg)](https://www.paypal.me/elevatebart)

Logo by [Benjamin Cognard](https://twitter.com/benbnur).

## License

[MIT License](https://github.com/vue-styleguidist/vue-styleguidist/blob/master/LICENSE)
