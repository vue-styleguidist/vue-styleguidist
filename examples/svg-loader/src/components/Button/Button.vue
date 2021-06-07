<template>
	<button @click="onClick($event)">
		<span v-if="!!$slots.leftIcon" class="left-icon">
			<!-- @slot Use this slot to place the left icon content -->
			<slot name="leftIcon" />
		</span>
		<!-- @slot Use this slot to place the button content -->
		<slot>No content provided</slot>
	</button>
</template>

<script>
export default {
	name: 'Button',
	methods: {
		onClick($event) {
			/**
			 * Triggered when button is clicked.
			 * Allows to use component without .native
			 *
			 * @event click
			 * @property {event}
			 * @type {object}
			 */
			this.$emit('click', $event)
		}
	}
}
</script>

<style scoped>
button {
	min-width: 8.125rem;
	min-height: 2.1875rem;
	padding: 0.2rem 0.4rem;
	color: black;
	text-align: center;
	text-transform: uppercase;
	vertical-align: center;
	background-color: white;
	border-radius: 0.25rem;
	outline: none;
}

button:hover {
	cursor: pointer;
	background-color: darken(white, 10%);
	transition: background-color 0.2s;
}

button:active {
	cursor: pointer;
}

span.left-icon {
	display: inline-block;
	width: 1rem;
	height: 1rem;
	margin-right: 0.2rem;
}
</style>

<docs lang="md">
Icon on the right Side

```vue
<template>
	<Button>
		<template v-slot:leftIcon>
			<test-icon></test-icon>
		</template>
		Push Me
	</Button>
</template>

<script>
import TestIcon from '../../assets/logo.svg'
// You can also use 'exports.default = {}' style module exports.

export default {
	components: {
		TestIcon
	}
}
</script>
```
</docs>
