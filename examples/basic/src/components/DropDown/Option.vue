<template>
  <option :value="val">
    <slot />
  </option>
</template>
<script>
export default {
	name: 'Option',
	props: {
		val: {
			type: String,
			required: true
		}
	}
}
</script>
