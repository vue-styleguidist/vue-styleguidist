/* eslint-disable import/prefer-default-export */
import Vue from 'vue'

/**
 * Component description
 */
export const Component = Vue.extend({
	name: 'component',

	props: {
		/**
		 * Color
		 * @values red, green
		 */
		color: {
			required: true,
			type: String,
			validator: (value: string) => ['red', 'green'].includes(value)
		}
	}, // props

	render() {
		return (
			<span className={[`color-${this.color}`]}>
				{/** @slot Default slot */}
				{this.$slots.default}
			</span>
		)
	} // render
})
