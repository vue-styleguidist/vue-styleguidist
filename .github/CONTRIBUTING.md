# Development Setup

This project uses a monorepo setup that requires using [pnpm](https://pnpm.js.org/) because it relies on [workspaces](https://pnpm.js.org/en/workspaces).

```sh
# install dependencies
pnpm i
```

## Dependency architecture

In this monorepo, `vue-cli-plugin-styleguidist` depends on `vue-styleguidist` which in turn depends on `vue-docgen-api`. So if you change something in vue-docgen-api, a new version of each module is going to be delivered. Whereas if you only change something in the plugin, only the plugin will be delivered.

## Testing Tips

If you run `pnpm test`, yarn will run eslint linting, then test vue-styleguidist and vue-docgen-api then test the plugin. Finally, it will format all your files using prettier.

The full test suite is rather slow, because it has a number of e2e tests that perform full webpack builds of actual projects. To narrow down the tests needed to run during development, you can pass the test script a regex/glob to match test filenames:

```sh
pnpm test:vitest <filenameRegex>
```

Note the regex matches against full paths relative to the project root, so for example if you want to test all the docgen tests `packages/vue-docgen-api`, you can simply run:

```sh
pnpm test:vitest vue-docgen-api
```

> For developing the API in the best conditions, you can open the package as the root of your workspace in vscode. Then the vitest plugin will allow to debug, place breakpoints and inspect variables.

To test the cli plugin, everything has to be run in sequence. vue-styleguidist always uses the same http port (8080) and one cannot have 2 instances running at the same time. To run test for the plugin just run this:

```sh
pnpm test:plugin
```

## The Scripts

Simplify running and maintaining the examples, compile all packages, test and showcase.

### pnpm compile

This command will compile `vue-docgen-api` typescript, then transpile `vue-styleguidist/src` with babel It is never run automatically so if you make any changes to the react components in `src`, don't forget to compile again.

`pnpm compile:watch` will launch the babel compilation of the `rsg-components` folder in watch mode.

My favoured developing setup: 2 terminal windows, one with `pnpm compile:watch` the other with `pnpm start`.

### pnpm start

Allows you to run the examples against your local version of styleguidist. An extra parameter allows you to choose which one. By default, it will run `basic`

```sh
pnpm start customised
```

This command will run the `customised` example. It will look for `examples/customised/styleguide.config.js` and run styleguidist on it. You can omit the last param and do just `pnpm start` to run the basic example.

### pnpm build

Same command as `pnpm start` but will start the basic example of styleguidist to see what the final bundle is going to look like.


## Changesets

To deliver each package in the monorepo, we use [changesets](../.changeset/README.md). It allows us to deliver each package independently and to have a changelog for each package.
In your PR, please include at least one changeset markdown file explaining what you changed. It will trigger the delivery of the change in the next release.

