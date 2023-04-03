import config from './cypress.config'

if(config.component){
  config.component.specPattern = 'src/client/**/*.cy.vue3.tsx'
}

export default config