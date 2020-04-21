<template>
	<div>
		<Icon />
		<slot />
	</div>
</template>
<script>
import Icon from '@/components/Icon'
import { cart } from 'my-cart'

/**
 * @displayName NotFilters
 */
export default {
	components: { Icon }
}
</script>
