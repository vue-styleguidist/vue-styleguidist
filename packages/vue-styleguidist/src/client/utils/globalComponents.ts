import { VueConstructor } from "vue";

const globalComponents: Record<string, VueConstructor>  = {}

export function registerGlobalComponents(app: any): any{
  Object.entries(globalComponents)
    .forEach(([name, component]) => {
      app.component(name, component)
    })
  return app
}

export function addGlobalComponentToRegistration(name: string, component: VueConstructor) {
  globalComponents[name] = component
}