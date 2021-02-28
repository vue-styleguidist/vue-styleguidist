
const QuasarConfig = require('@quasar/app/lib/webpack/index')

const cfg = {
  ctx: {
    dev: true,
    prod: false,
    mode: {
      spa: true
    },
    modeName: 'spa'
  },
  build: {
    sourceMap: true,
    transpileDependencies: []
  },
  framework: {
    all: true
  },
  supportTS: false,
  vendor: {},
  __html: {
    variables: {
      ctx: {
        dev: true,
        prod: false,
        mode: {
          spa: true
        },
        modeName: 'spa'
      },
      process: {
        env: {}
      }
    }
  },
  sourceFiles: {
    rootComponent: '../src/App.vue',
    router: '../src/router/index',
    store: '../src/store/index',
    indexHtmlTemplate: '../src/index.template.html'
  },
  devServer: {}
}

async function quasarconf () {
  const config = await QuasarConfig(cfg)
  return config
}

module.exports = async function () {
  return quasarconf()
}
