import { createApp, Vue2, isVue3 } from 'vue-inbrowser-compiler-utils'
import { registerGlobalComponents } from '../../utils/globalComponents'

export function getVueApp(component: any, el: HTMLElement, enhancePreviewApp: (app:any) => void) {
	return isVue3
		? (() => {
				const app = createApp(component)
        enhancePreviewApp(app)
				registerGlobalComponents(app)
				app.mount(el)
				return app
		  })()
		: new Vue2(component).$mount(el)
}
