import config from './cypress.config'
import { resolve } from 'path'

if(config.component){
  config.component.specPattern = resolve(__dirname, 'src/client/**/*.cy.vue3.tsx')
}

export default config