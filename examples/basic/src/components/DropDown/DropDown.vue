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
