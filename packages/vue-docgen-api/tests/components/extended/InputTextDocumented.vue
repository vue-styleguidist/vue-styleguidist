<template>
	<div>
		<!--How to include the question here???-->
		<input :placeholder="placeholder" />
	</div>
</template>
<script>
import BaseIgnored from './BaseIgnored.vue'
import { multi, other } from '../../mixins'
import { deep } from '../../mixins'

/**
 * Description InputTextDocumented
 */
export default {
  extends: BaseIgnored,
	mixins: [multi, other, deep],
	props: {
		placeholder: {
			type: String
		}
	}
}
</script>
