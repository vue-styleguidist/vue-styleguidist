<template>
  <div>
    <button @click="$emit('close')">
      X
    </button>
    <slot />
  </div>
</template>

<script>
/**
 * @example [none]
 */
export default {}
</script>

<style scoped>
button {
	float: right;
}
</style>
