import * as Vue from 'vue'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component, el){
  Vue.createApp ? registerGlobalComponents(Vue.createApp(component)).mount(el) : (new Vue.default(component)).$mount(el)
}
