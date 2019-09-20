<script>
const ctx = require.context('some/path', true, /.jpg$/)

/**
 * Partial mapping, object spread operator example
 */
// prettier-ignore
export default {
	'name': 'example',
	'props': {
		'color':{
			'type': String,
			'default': 'blue'
		},
		'anotherProp':{
			'type': String,
			'required': true
		}
	},
	'computed': {
		'total': function() {
			return this.$store.getters.allCustomers.length
		}
	},
	'methods': {
		/**
		 * Sets the order
		 *
		 * @public
		 * @version 1.0.5
		 * @since Version 1.0.1
		 * @param {string} key Key to order
		 * @returns {string} Test
		 */
		async onSubmit() {
			let res = await api.post(this.params)
			this.response = response
		}
	},
	'mounted': function() {
		console.log('Second component loaded')
	}
}
// prettier-ignore
</script>
