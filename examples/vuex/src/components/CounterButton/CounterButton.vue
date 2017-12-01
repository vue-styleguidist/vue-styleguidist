<template>
<div class="CounterButton">
	<button class="button"
		@click.prevent="increment">
		{{count}}
	</button>
</div>
</template>

<script>
import { mapGetters } from "vuex";

/**
 * Button that counts how many times it was pressed and exposes a `@public` method to reset itself.
 */
export default {
	name: "CounterButton",
	computed: {
		...mapGetters(["count"]),
	},
	methods: {
		/**
		 * Increments the counter. This method is not marked @public and is not visible in the styleguide.
		 */
		increment() {
			this.$store.commit('increment')
			/**
			 * After increment event
			 * @event after
			 * @type {number}
			 */
			this.$emit("after", this.value);
		}
	},
};
</script>
<docs>
Don't forget that you can debug it with [vue-devtools](https://github.com/vuejs/vue-devtools)

```js
    <CounterButton/>
```
</docs>
