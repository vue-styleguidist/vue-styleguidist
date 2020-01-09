<template>
	<div>
		<!--How to include the question here???-->
		<input :placeholder="placeholder" />
	</div>
</template>
<script>
import Base from './Base.vue'
import { multi, other } from '../../mixins'
import { deep } from '../../mixins'

/**
 * Description InputTextDocumented
 */
export default {
	extends: Base,
	mixins: [multi, other, deep],
	props: {
		placeholder: {
			type: String
		}
	}
}
</script>
