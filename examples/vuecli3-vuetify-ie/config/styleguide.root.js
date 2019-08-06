import Vuetify from 'vuetify'
import VueI18n from 'vue-i18n'
import Languages from './Languages.vue'
import './global.scss'
import messages from './i18n'

// Vuetify instance to be applied to the Vue app instance
const vuetify = new Vuetify()

const i18n = new VueI18n({
	locale: 'en',
	messages
})

export default function(previewComponent) {
	return {
		i18n,
		vuetify,
		render(h) {
			return h(
				// Vuetify requires that elements are wrapped in v-app component
				'v-app',
				{
					props: {
						id: 'v-app'
					}
				},
				[h(Languages), h(Object.assign(previewComponent))]
			)
		}
	}
}
