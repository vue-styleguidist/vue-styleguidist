import Vue from 'vue'
import { createApp } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component, el){
  Vue?.version?.startsWith('3.') ? registerGlobalComponents(createApp(component)).mount(el) : (new Vue(component)).$mount(el)
}
