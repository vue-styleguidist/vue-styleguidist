<template>
	<div class="CounterButton">
		<button @click.prevent="increment">
			{{ count }}
		</button>
	</div>
</template>

<script>
/**
 * Button that counts how many times it was pressed and exposes a `@public` method to reset itself.
 * @position 2
 */
export default {
	name: 'CounterButton',
	data() {
		return { count: 0 }
	},
	methods: {
		/**
		 * Increments the counter. This method is not marked @public and is not visible in the styleguide.
		 */
		increment() {
			this.count++
			/**
			 * After increment event
			 * @event after
			 * @property {number} count the count
			 * @property {boolean} second another parameter
			 */
			this.$emit('after', this.count, false)
		}
	}
}
</script>

<style scoped>
button {
	background: #fbfbfb;
	border: 1px solid #666;
	border-radius: 6px;
	padding: 5px;
	width: 100px;
}
</style>

<docs>
Don't forget that you can debug it with [vue-devtools](https://github.com/vuejs/vue-devtools)

```vue live
<CounterButton/>
```
</docs>
