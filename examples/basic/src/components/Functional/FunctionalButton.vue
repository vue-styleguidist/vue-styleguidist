<template>
	<!-- @prop {string} id name attribute of the button -->
	<button :name="props.id" style="background: pink">
		<!-- @slot name of the button -->
		<slot />
	</button>
</template>

<docs lang="md">
Document your functional templates in docs blocks

```vue
<FunctionalButton id="test">
    In the docs block
</FunctionalButton>
```
</docs>
