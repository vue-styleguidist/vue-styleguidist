import MyInput from 'vue'

/* @vue/component */
export default MyInput.extend({
	name: 'selectable',

	model: {
		prop: 'inputValue',
		event: 'change'
	},

	props: {
		color: {
			type: String,
			default: 'primary'
		},
		id: String,
		inputValue: null,
		falseValue: null,
		trueValue: null,
		multiple: {
			type: Boolean,
			default: null
		},
		label: String
	}
})
