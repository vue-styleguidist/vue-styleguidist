<template>
  <div class="CounterButton">
    <button class="button" @click.prevent="increment">{{value}}</button>
  </div>
</template>

<script>
/**
 * Button that counts how many times it was pressed and exposes a `@public` method to reset itself.
 */
export default {
	name: 'CounterButton',
	data() {
		return {
			value: 0
		}
	},
	methods: {
		/**
		 * Increments the counter. This method is not marked @public and is not visible in the styleguide.
		 */
		increment() {
			this.value++
			/**
			 * After increment event
			 * @event after
			 * @type {number}
			 * @called {number}
			 * @notice {string}
			 */
			this.$emit('after', this.value, 1, 'test')
		},
		/**
		 * Sets the counter to a particular value.
		 *
		 * @public
		 * @version 1.0.5
		 * @param {Number} newValue New value for the counter
		 * @returns {string} Test
		 */
		set(newValue) {
			this.value = parseInt(newValue, 10)
		}
	}
}
</script>
