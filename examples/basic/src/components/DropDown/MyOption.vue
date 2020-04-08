<template>
  <option :value="val">
    <slot />
  </option>
</template>
<script>
export default {
	name: 'MyOption',
	props: {
		val: {
			type: String,
			required: true
		}
	}
}
</script>
