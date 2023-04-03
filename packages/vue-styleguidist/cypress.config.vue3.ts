import { resolve } from 'path'
import config from './cypress.config'

if(config.component){
  config.component.specPattern = resolve(__dirname, 'src/client/**/*.cy.vue3.tsx')
}

export default config