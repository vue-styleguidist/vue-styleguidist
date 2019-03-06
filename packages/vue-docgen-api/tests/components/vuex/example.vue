<template>
</template>
<script>
import { mapGetters } from 'vuex'
const ctx = require.context('some/path', true, /.jpg$/)

/**
 * Partial mapping, object spread operator example
 */
export default {
	name: 'example',
	computed: {
		total() {
			return this.$store.getters.allCustomers.length
		},
		...mapGetters({
			duplicate: 'hasDuplicateCustomer',
			characters: 'alphaKeys'
		})
	},
	methods: {
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
	mounted() {
		console.log('Second component loaded')
	}
}
</script>
