import VueI18n from 'vue-i18n'
import vuetify from '../src/plugins/vuetify'
import messages from './i18n'
import Languages from './Languages.vue'

const i18n = new VueI18n({
	locale: 'en',
	messages
})

export default previewComponent => {
	// https://vuejs.org/v2/guide/render-function.html
	return {
		vuetify,
		i18n,
		render(createElement) {
			return createElement('v-app', [createElement(Languages), createElement(previewComponent)])
		}
	}
}
