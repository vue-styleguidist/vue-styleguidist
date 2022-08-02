import DefaultTheme from 'vitepress/theme'
import VueLive from './components/vue-live-with-layout'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('VueLive', VueLive)
  }
}