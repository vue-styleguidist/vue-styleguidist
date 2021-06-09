import { createApp } from 'vue'

const createExample = options => {
	const app = createApp(options)
	globalComponents.forEach(({ key, comp }) => {
		app.component(key, comp)
	})
	return app
}

export const globalComponents = []

export default createExample
