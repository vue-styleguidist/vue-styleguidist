<template>
	<div class="Button">
		<button class="button" :style="{ color: color, fontSize: fontSize }" @click.prevent="onClick">
			<!-- 
        @slot Content of button
        @binding {boolean} test describe the binding
        @binding {string} message describe the message bng
      -->
			<slot :test="false" :message="'hello'" />
		</button>
	</div>
</template>

<script>
/**
 * The only true button.
 *
 * @position 1
 * @author [Me](mailto:hey@hey.com)
 * @since 1.2.3
 * @example ./Second-ReadMe.md
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
		 * @values small, normal, large
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
