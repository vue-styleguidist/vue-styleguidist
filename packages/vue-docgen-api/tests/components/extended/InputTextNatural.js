import Vue from 'vue'
import Base from './Base.vue'

/**
 * Description InputText
 */
export default Vue.extend({
	name: 'InputText',
	extends: Base,
	props: ['placeholder'],
	template: `<div>
	<!--How to include the question here???-->
	<input :placeholder="placeholder" />
</div>`
})
