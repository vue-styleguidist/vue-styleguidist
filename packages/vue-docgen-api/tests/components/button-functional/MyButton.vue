<template functional>
  <div>
    <button :style="`width: ${props.size}px;`" class="buttonComponent">
      <!-- @slot Use this slot default -->
      <slot/>
    </button>
    {{props.text}}
  </div>
</template>

<script>
export default {
	props: {
		size: Number,
		default: 200
	}
}
</script>
