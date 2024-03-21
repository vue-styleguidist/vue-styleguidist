import { Component } from 'vue'

const globalComponents: Record<string, Component> = {}

export function registerGlobalComponents(app: any): any {
	Object.entries(globalComponents).forEach(([name, component]) => {
		app.component(name, component)
	})
	return app
}

export function addGlobalComponentToRegistration(name: string, component: Component) {
	globalComponents[name] = component
}
