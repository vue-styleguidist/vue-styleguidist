<template>
<div class="PushButton">
	<button class="push-button" :style="{ color: color, fontSize: fontSize }">
		<slot></slot>
	</button>
</div>
</template>

<script>
/**
 * An example-less button.
 */
export default {
	name: 'PushButton',
	props: {
		color: {
			type: String,
			default: '#333'
		},
		/**
		 * `small, normal, large`
		 */
		size: {
			type: String,
			default: 'normal'
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
.push-button {
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
