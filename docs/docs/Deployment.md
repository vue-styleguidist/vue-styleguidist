# Deployment

Vue-Styleguidist can generate a static website. To deploy it, follow this short intro and choose one of the providers.

## Pre-requisites

First, specify the location where the styleguide site is going to be built using the [styledguideDir](/Configuration.md#styleguidedir) option. It will default to a `styleguide` folder beside your `styleguide.config.js`.

Check out the results of running the following command

```sh
yarn styleguide:build
```

Now, you should have a directory containing HTML and javascript. Let's deploy it.

## Deploy on [Netlify](https://www.netlify.com/)

1.  Connect Netlify to your GitHub account
1.  Select the repo to deploy
1.  Set the build command as `styleguidist build`
1.  The build folder will be `styleguide` if you have `styleguide.config.js` at the root of your repository and left out the option. If you changed the `styleguideDir` option, pick the new path chosen.

## Deploy on [Zeit Now](https://zeit.co/)

Connect your GitHub account with Zeit.

Create a `now.json` file at the root of your repository containing

```json
{
  "name": "vsg-example",
  "builds": [
    {
      "src": "package.json",
      "use": "@now/static-build",
      "config": { "distDir": "styleguide" }
    }
  ]
}
```

And make sure to prepare a `"build-now"` script in your `package.json` that builds the styleguide

```json
{
  "scripts": {
    "build-now": "styleguidist build"
  }
}
```

Adjust the `distDir` config according to your [styledguideDir](/Configuration.md#styleguidedir) option.

## Deploy on GitHub Pages

[Github Pages](https://pages.github.com/) can be very useful to serve static websites. It needs a little more effort than Netlify. It uses your repository files as the static pages themselves.

1.  Create a repo called `yourgithubid.github.io`. Replace yourgithubid by your github id.
1.  Enable GitHub pages on it. `Settings > Options > Github Pages`
1.  Add an index.html in it. Whatever the content is, it does not matter.
1.  Check that you can access the created page at https://yourgithubid.github.io/
1.  Next, back on your library, run `styleguidist build`.
1.  Upload (commit) in the `yourgithubid.github.io` repository the contents of your `styleguide` folder.
1.  Go to the URL and see the styleguide live.

## Automate deployment on travisCI

Zeit and Netlify simplify your website deployment automation. If you are going with GitHub pages though, because it is free for instance, you might want to build automation yourself.

This is how the very documentation you are reading is deployed automatically

```yml
    deploy:
        provider: pages
        skip-cleanup: true
        local-dir: styleguide
        target-branch: master
        repo: yourgithubid/yourgithubid.github.io
        github-token: $GITHUB_TOKEN # Set in the settings page of your repository, as a secure variable
        keep-history: true
        on:
            branch: master # only deploy when a commit or a merge is pushed to master
```

[Read More](https://docs.travis-ci.com/user/deployment/pages/)
