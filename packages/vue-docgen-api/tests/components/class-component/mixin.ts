import Vue from 'vue'
import Component from 'vue-class-component'

@Component({
	props: {
		/**
		 * color of the button
		 */
		color: String
	}
})
export default class MyMixin extends Vue {
	public mixinValue = 'Hello'
}
