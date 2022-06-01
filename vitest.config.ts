import { defineConfig } from 'vitest/config'
import { typescriptPaths } from 'rollup-plugin-typescript-paths'

export default defineConfig({
	test: {
		environment: 'happy-dom',
		globals: true,
		exclude: ['**/node_modules/**', '**/lib/**', '**/dist/**']
	},
	plugins: [
		typescriptPaths({
			tsConfigPath: './tsconfig.json'
		})
	]
})
