import { createApp, Vue2, isVue3 } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueAppFactory() {
	if (isVue3) {
		return (component: any, el: HTMLElement, enhancePreviewApp: (app: any) => void) => {
			const app = createApp(component)
			enhancePreviewApp(app)
			registerGlobalComponents(app)
			app.mount(el)
			return app
		}
	} else {
		return (component: any, el: HTMLElement) => {
			const app = new Vue2(component)
			return app.$mount(el)
		}
	}
}
