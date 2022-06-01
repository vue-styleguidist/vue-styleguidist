import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		include: ['**/__e2e__/**/*.js'],
		exclude: ['**/node_modules/**'],
		testTimeout: 80000
	}
})
