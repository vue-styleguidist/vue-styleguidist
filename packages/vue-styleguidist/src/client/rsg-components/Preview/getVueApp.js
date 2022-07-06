import VuePackage from 'vue/package.json'
import { createApp, Vue2 } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component, el){
  VuePackage.version.startsWith('3.') ? registerGlobalComponents(createApp(component)).mount(el) : (new Vue2(component)).$mount(el)
}
