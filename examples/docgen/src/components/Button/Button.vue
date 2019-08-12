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

<style scope>
.button {
	padding: 0.5em 1.5em;
	background-color: $primary;
	border: 1px solid $secondary;
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
<docs>
Use vue live right here too

````markdown
```jsx live
<Button>I’m transparent!</Button>
```
````

```jsx live
<Button>I’m transparent!</Button>
```

To render an example as highlighted source code remove the live modifier

```html
<Button>I’m transparent!</Button>
```

</docs>
