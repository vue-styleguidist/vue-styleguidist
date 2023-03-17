import { expect } from 'vitest'
import Vue from 'vue'
import { URL } from 'url'
import {resolve} from 'path'

// @ts-expect-error
const __dirname = new URL('.', import.meta.url).pathname

const rootFolder = resolve(__dirname, '../')

Vue.config.productionTip = false
Vue.config.devtools = false

expect.addSnapshotSerializer({
  serialize(val) {
    // `printer` is a function that serializes a value using existing plugins.
    return val.replaceAll(rootFolder, '')
  },
  test(val) {
    return typeof val === 'string' && val.includes(rootFolder)
  },
})