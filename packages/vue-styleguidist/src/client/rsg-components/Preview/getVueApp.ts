import { createApp, Vue2, isVue3 } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component: any, el: HTMLElement) {
	return isVue3
		? (() => {
				const app = createApp(component)
				registerGlobalComponents(app)
				app.mount(el)
				return app
		  })()
		: new Vue2(component).$mount(el)
}
