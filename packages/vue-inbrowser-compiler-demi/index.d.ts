/* eslint-disable */
import { parse } from '@vue/compiler-sfc'

export declare const isVue3: boolean
export declare const Vue2: any
export { h, createApp, App } from 'vue'
export { compileTemplate, compileScript } from '@vue/compiler-sfc'
export declare function parseComponent(source: string): ReturnType<typeof parse>['descriptor']
