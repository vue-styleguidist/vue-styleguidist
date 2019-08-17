<template>
	<div class="CounterButton">
		<button class="button" @click.prevent="increment">{{count}}</button>
	</div>
</template>

<script>
/**
 * Button that counts how many times it was pressed and exposes a `@public` method to reset itself.
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
			 * @type {number}
			 */
			this.$emit('after', this.value)
		}
	}
}
</script>
<docs>
Don't forget that you can debug it with [vue-devtools](https://github.com/vuejs/vue-devtools)

```vue live
<CounterButton/>
```
</docs>
