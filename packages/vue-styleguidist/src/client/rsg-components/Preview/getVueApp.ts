import { createApp, Vue2, isVue3 } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component: any, el: HTMLElement, enhancePreviewApp: (app: any) => void) {
	if (isVue3) {
		const app = createApp(component)
		enhancePreviewApp(app)
		registerGlobalComponents(app)
		app.mount(el)
		return app
	} else {
		const app = new Vue2(component)
		return app.$mount(el)
	}
}
