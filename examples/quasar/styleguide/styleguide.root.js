import Vue from 'vue'
import Quasar from 'quasar'
import store from "../src/store"
Vue.use(Quasar)

import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

Vue.mixin({
  data () {
    return {
      quasar: {
        title: 'Quasar Framework',
        caption: 'Build high-performance VueJS user interfaces in record time',
        color: 'primary',
        link: 'https://quasar.dev/',
        icon: 'img:https://cdn.quasar.dev/logo/svg/quasar-logo.svg'
      }
    }
  }
})


export default previewComponent => {
  // https://vuejs.org/v2/guide/render-function.html
  return {
    store,
    render (createElement) {
      return createElement(previewComponent)
    }
  }
}
