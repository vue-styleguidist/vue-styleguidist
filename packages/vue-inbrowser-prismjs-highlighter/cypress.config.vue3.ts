import { defineConfig } from 'cypress'
import * as path from 'path'
import config from './cypress.config'

if(config.component){
  config.component.specPattern = path.resolve(__dirname,'src/**/*.cy.vue3.ts')
}

export default defineConfig(config)