import { createApp, Vue2, isVue3 } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component, el){
  isVue3 ? registerGlobalComponents(createApp(component)).mount(el) : (new Vue2(component)).$mount(el)
}
