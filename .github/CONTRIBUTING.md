## Development Setup

This project uses a monorepo setup that requires using [Yarn](https://yarnpkg.com) because it relies on [Yarn workspaces](https://yarnpkg.com/blog/2017/08/02/introducing-workspaces/).

``` sh
# install dependencies
yarn
```

### Dependency architecture

In this monorepo, `vue-cli-plugin-styleguidist` depends on `vue-styleguidist` which in turn depends on `vue-docgen-api`. So if you change something in vue-docgen-api, a new version of each module is going to be delivered. Whereas if you only change something only in the plugin, nonly the plugin will be delivered.


### Testing Tips

If you run `yarn test`, yarn will run eslint linting, then test vue-styleguidist and vue-docgen-api then test the plugin. Finally it will format all your files using prettier.

The full test suite is rather slow, because it has a number of e2e tests that perform full webpack builds of actual projects. To narrow down the tests needed to run during development, you can pass the test script a regex to match test filenames:

``` sh
yarn test:jest <filenameRegex>
```

Note the regex matches against full paths relative to the project root, so for example if you want to test all the docgen tests `packages/vue-docgen-api`, you can simply run:

``` sh
yarn test:jest vue-docgen-api
```

You can also pass `--watch` to run tests in watch mode.

Note that `jest --onlyChanged` isn't always accurate because some tests spawn child processes.

To test the cli plugin, everything has to be run in sequence. vue-styleguidist always uses the same http port (8080) and one cannot have 2 instances running at the same time.
To run test for the plugin just run this:

``` sh
yarn test:plugin
```
