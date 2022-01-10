import { fileURLToPath } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	resolve: {
		alias: {
			'vsg-components': fileURLToPath(new URL('./src/client/components', import.meta.url))
		}
	}
})
