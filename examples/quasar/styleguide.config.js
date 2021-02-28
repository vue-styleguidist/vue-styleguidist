const path = require('path')

const getQuasarWebpack = require('./styleguide/getQuasarWebpack')

const FILTERED_PLUGINS = [
  'WebpackBarPlugin', // taken out like the example of nuxt
  'VueSSRClientPlugin', // taken out like the example of nuxt
  'HotModuleReplacementPlugin', // taken out like the example of nuxt
  'FriendlyErrorsWebpackPlugin', // taken out like the example of nuxt
  'HtmlWebpackPlugin', // taken out like the example of nuxt
  'lazyCompileHook', // I couldn't get it to work
  'HtmlAddonsPlugin', // I couldn't get it to work
  'DefinePlugin' // I couldn't get it to work
]

module.exports = async () => {
  const quasarWebpack = await getQuasarWebpack()

  const webpackConfig = {
    module: {
      rules: [
        ...quasarWebpack.module.rules.filter(
          // remove the eslint-loader
          a => a.loader !== 'eslint-loader'
        )
      ]
    },
    resolve: { ...quasarWebpack.resolve },
    plugins: [
      ...quasarWebpack.plugins.filter(
        // And some other plugins that could conflcit with ours
        p => FILTERED_PLUGINS.indexOf(p.constructor.name) === -1
      )
    ]
  }

  return {
    title: 'Quasar + Style Guide',
    components: './src/components/**/[A-Z]*.vue',
    renderRootJsx: path.join(__dirname, 'styleguide/styleguide.root.js'),
    webpackConfig,
    styleguideDir: './styleguide/dist'
  }
}
