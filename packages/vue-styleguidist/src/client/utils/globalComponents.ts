import { App, ComponentOptions } from "vue";

const globalComponents: Record<string, ComponentOptions>  = {}

export function registerGlobalComponents(app: App): App{
  Object.entries(globalComponents)
    .forEach(([name, component]) => {
      app.component(name, component)
    })
  return app
}

export function addGlobalComponentToRegistration(name: string, component: ComponentOptions) {
  globalComponents[name] = component
}