<template>
	<div>
		<template v-for="op in options" :key="op.value">
			<input type="radio" :value="op.value" name="hello" />
			<label :for="op.value">{{ op.text }}</label>
		</template>
	</div>
</template>
<script>
export default {
	props: {
		options: {
			type: Array,
			default: () => []
		}
	}
}
</script>

<docs lang="md">
### or import it from the docs block

Example can be their own file. Use the following syntax.

````markdown
```[import](./_radioExample.vue)
this text is going to be ignored
```
````

```[import](./_radioExample.vue)
this text is going to be ignored
```

They can be imported from anywhere from your source. To keep your code tidy and the navigation easy, keep then in the same directory as your component.

````markdown
```[import](./examples/_example.js)
If you do this, vscode will not recognize the import as a link.
Prefer examples in the same folder as your comoponent.
```
````

```[import](./examples/example.js)
this text is going to be ignored
```
</docs>
