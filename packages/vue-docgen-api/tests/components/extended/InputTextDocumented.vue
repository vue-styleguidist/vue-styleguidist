<template>
  <div>
    <!--How to include the question here???-->
    <input :placeholder="placeholder">
  </div>
</template>
<script>
import Base from './Base.vue'

/**
 * Description InputTextDocumented
 */
export default {
	extends: Base,
	props: {
		placeholder: {
			type: String
		}
	}
}
</script>
