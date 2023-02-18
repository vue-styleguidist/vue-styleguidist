import type { App } from 'vue-inbrowser-compiler-utils'
import type { StyleguidistConfig } from "../types/StyleGuide"

/**
 * Helper function to create type safe configs in JavaScript
 * @param config passed config
 * @returns the config passed without any changes
 */
export function defineConfig(config: StyleguidistConfig): StyleguidistConfig {
	return config
}

/**
 * Helper function for typing the contents of the `enhancePreviewApp` function
 * @param enhance the enhancer function 
 * @returns the function passed without any changes
 */
export function defineEnhanceApp(enhance: (app: App) => void): (app: App) => void {
	return enhance 
}