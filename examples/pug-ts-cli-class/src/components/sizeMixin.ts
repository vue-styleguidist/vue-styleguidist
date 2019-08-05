import Vue from 'vue'
import Component from 'vue-class-component'

/**
 * @mixin
 */
@Component({
	props: {
		/**
		 * Set size of the element
		 */
		size: {
			type: String,
			default: '14px'
		}
	}
})
export default class SizeMixin extends Vue {}
