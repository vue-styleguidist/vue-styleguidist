<template>
<div class="Button">
	<v-btn :color="color"
		@click.prevent="onClick"
		:style="{ fontSize: fontSize }">
		<slot></slot>
	</v-btn>
</div>
</template>

<script>
import loggerMixin from '../../mixins/loggerMixin';

/**
 * The only true button.
 */
export default {
	name: 'Button',
	mixins: [loggerMixin],
	props: {
		/**
		 * The color for the button. `primary, secondary, accent, error, info, success, warning`
		 *
		 */
		color: {
			type: String,
			default: 'success',
		},
		/**
		 * The size of the button
		 * `small, normal, large`
		 */
		size: {
			type: String,
			default: 'normal',
		},
		/**
		 * Gets called when the user clicks on the button
		 * @ignore
		 */
		onClick: {
			type: Function,
			default: event => {
				console.log('You have clicked me!', event.target);
			},
		},
	},
	computed: {
		fontSize() {
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
		},
	},
};
</script>

<style scope>
.button {
	padding: 0.5em 1.5em;
	color: #666;
	background-color: #fff;
	border: 1px solid currentColor;
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
You can add a custom classes to an example wrapper (```` ```js { "className": "checks" }````):

```js { "className": "checks" }
<Button>{{$t("message.hello")}}</Button>
```

Or disable an editor by passing a `noeditor` modifier (```` ```js noeditor````):

```jsx noeditor
<Button>{{$t("message.hello")}}</Button>
```

To render an example as highlighted source code add a `static` modifier: (```` ```js static````):

```js static
import Vue from 'vue';
```

Fenced blocks with other languages are rendered as highlighted code:

```html
<h1>{{$t("message.hello")}}</h1>
```
</docs>
