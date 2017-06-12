<template>
<div class="ButtonComponent">
	<button class="button"
		@click.prevent="onClick"
		:style="{ color: color, fontSize: fontSize }">
		<slot></slot>
	</button>
</div>
</template>

<script>

/**
 * The only true button.
 */
export default {
	name: 'ButtonComponent',
	props: {
		/**
		 * The color for the button.
		 */
		color: {
			type: String,
			default: '#333'
		},
		/**
		 * The size of the button
		 * `small, normal, large`
		 */
		size: {
			type: String,
			default: 'normal'
		},
		/**
		 * Gets called when the user clicks on the button
		 */
		onClick: {
			type:Function,
			default: (event) => {
				console.log('You have clicked me!', event.target);
			}
		}
	},
	computed: {
		fontSize(){
			let size;
			switch (this.size) {
				case 'small':
					size = '10px';
					break;
				case 'normal':
					size = '14px';
					break;
				case 'large':
					size = '18px';
					break;
			}
			return size;
		}
	}
}
</script>

<style scope>
.button {
	padding: .5em 1.5em;
	color: #666;
	background-color: #fff;
	border: 1px solid currentColor;
	border-radius: .3em;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
}
</style>
