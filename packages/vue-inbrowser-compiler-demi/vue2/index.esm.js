import Vue from 'vue'
import compile from 'vue-template-compiler'

export const h = () => {}
export const createApp = () => {}
export const resolveComponent = name => name
export const isVue3 = false
export { Vue as Vue2 }
export const compileTemplate = template => ({ code: compile(template).render })
