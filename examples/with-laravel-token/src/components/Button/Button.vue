<template>
	<div class="Button">
		<button class="button" @click.prevent="onClick" :style="{ color: color, fontSize: fontSize }">
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
		 * The size of the button
		 * `small, normal, large`
		 */
		size: {
			type: String,
			default: 'normal'
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
	},
	beforeMount() {
		if (window.Laravel.csrfToken) {
			console.log('TOKEN', window.Laravel.csrfToken)
		} else {
			throw Error('access denied')
		}
	},
	computed: {
		fontSize() {
			let size
			switch (this.size) {
				case 'small':
					size = '10px'
					break
				case 'normal':
					size = '14px'
					break
				case 'large':
					size = '18px'
					break
			}
			return size
		}
	}
}
</script>

<style lang="scss" scope>
.button {
	padding: 0.5em 1.5em;
	border-radius: 0.3em;
	text-align: center;
	vertical-align: middle;
	cursor: pointer;
}
.checks {
	background-image: linear-gradient(45deg, #f5f5f5 25%, transparent 25%),
		linear-gradient(-45deg, #f5f5f5 25%, transparent 25%),
		linear-gradient(45deg, transparent 75%, #f5f5f5 75%),
		linear-gradient(-45deg, transparent 75%, #f5f5f5 75%);
	background-size: 16px 16px;
	background-position: 0 0, 0 8px, 8px -8px, -8px 0px;
}
</style>

<docs lang="md">
It is even possible to use outside provided tokens.

```jsx
<Button>OK</Button>
```

To do this, you need to create a mock file containing the correct tokens. Then reference it in the [require options](https://vue-styleguidist.github.io/Configuration.html#require) in your styleguide.config.js file.<template></template>
</docs>
