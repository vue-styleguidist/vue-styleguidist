<template>
  <select name="mySelect">
    <slot />
  </select>
</template>
<script>
/**
 * @requires ./Option.vue
 */
export default {
	name: 'DropDown'
}
</script>
<docs>
```jsx
<DropDown>
    <Option val="1">test</Option>
    <Option val="1">other</Option>
</DropDown>
```
</docs>
