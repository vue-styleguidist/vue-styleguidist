<template>
	<div>
		<!--How to include the question here???-->
		<input :placeholder="placeholder" />
	</div>
</template>
<script>
import Base from './Base.vue'
import { multi, other } from '../../mixins'

/**
 * Description InputTextDocumented
 */
export default {
	extends: Base,
	mixins: [multi, other],
	props: {
		placeholder: {
			type: String
		}
	}
}
</script>
