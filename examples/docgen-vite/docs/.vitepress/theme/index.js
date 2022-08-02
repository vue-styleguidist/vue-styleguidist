import DefaultTheme from 'vitepress/theme'
import { VueLive } from 'vue-live'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('VueLive', VueLive)
  }
}