import { defineConfig } from 'vue-styleguidist'

declare const plugin: {
	(api: any, options: any): void
	defineConfig: typeof defineConfig
}

export = plugin
