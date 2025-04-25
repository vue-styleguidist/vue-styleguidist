import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./vitest.config.vue3.ts",
  "./vitest.config.ts",
  "./vitest.config.plugin.ts",
  "./packages/vue-docgen-api/vitest.config.ts"
])
