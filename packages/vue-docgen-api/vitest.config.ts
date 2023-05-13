import { defineConfig } from 'vitest/config'
import globalConfig from '../../vitest.config'

export default defineConfig({
	...globalConfig,
	test: {
		...(globalConfig as any).test,
		setupFiles: ['./tests/setup.ts']
	}
})
