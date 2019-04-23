# Deployment

Vue-Styleguidist generates a static website. It is now time to deploy it.

First specify the location where the styleguide site is going to be built using the [styledguideDir](/Configuration.md#styleguidedir) option. If you do not specify it it will by default be in a `styleguide` folder besides your `styleguide.config.js`.

Now that you have a

## Deploy on Netlify

1.  Connect Netlify to your github account
1.  Select the repo to deploy
1.  Set the build command as `styleguidist build`
1.  The build folder will be `styleguide` if you have `styleguide.config.js`. If you changed the `styleguideDir` this change follows

## Deploy on Zeit Now

In your `now.json` file use

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

And make sure to prepare a script in your `package.json` thand runs

```json
{
  "scripts": {
    "build-now": "styleguidist build"
  }
}
```

Adjust the `distDir` config according to your [styledguideDir](/Configuration.md#styleguidedir) option.

## Deploy on GitHub Pages

[Github Pages](https://pages.github.com/) can be very useful to host static websites. It needs a little more digging than for netlify. It actually uses your repository as the static pages themselves.

Create a repo called `yourgithubid.github.io` and enable github pages on it. Add an index.html in it.

You can now access your page at https://yourgithubid.github.io/

Next, run `styleguidist build`. Them upload (commit) in the same repository the contents of your `styleguide` folder. Go to the url and see the styleguide live.

## Automate deployment on travisCI

Zeit and Netlify make it easy for your website publication to be automated. If you are going with GitHub pages though, because it is free for instance, you might want to build automation yourself.

This is how the very documentation you are on is deployed automatically

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
