import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Docgen from '@vue-styleguidist/vite-plugin-vue-docgen'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		Docgen({
			docQuery: 'docgen'
		}),
		vue(),
		Inspect()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	}
})
