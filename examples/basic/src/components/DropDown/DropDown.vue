<template>
  <select name="mySelect">
    <slot />
  </select>
</template>

<script>
/**
 * @requires ./MyOption.vue
 */
export default {
	name: 'DropDown'
}
</script>

<docs>
```jsx
<DropDown>
    <MyOption val="1">test</MyOption>
    <MyOption val="2">other</MyOption>
</DropDown>
```
</docs>
