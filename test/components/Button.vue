<template>
	<div class="Button">
		<button class="button" @click.prevent="onClick" :style="{ color: color }">
			<slot></slot>
		</button>
	</div>
</template>

<script>
/**
 * The only true button.
 */
export default {
	name: 'Button',
	props: {
		/**
		 * The color for the button.
		 */
		color: {
			type: String,
			default: '#333'
		},
		/**
		 * Gets called when the user clicks on the button
		 * @ignore
		 */
		onClick: {
			type: Function,
			default: event => {
				console.log('You have clicked me!', event.target)
			}
		}
	}
}
</script>
