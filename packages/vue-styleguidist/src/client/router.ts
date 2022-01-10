import { createRouter, createWebHistory } from 'vue-router'
import DocumentationPage from 'vsg-components/DocumentationPage.vue'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/*',
			component: DocumentationPage
		}
	]
})

export default router
