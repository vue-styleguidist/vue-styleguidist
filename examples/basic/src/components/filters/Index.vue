<template>
  <div>
    <Input />
    <slot />
  </div>
</template>
<script>
import Input from '../Input/Input.vue'
import { logger } from '../../mixins/loggerMixin'

/**
 * @displayName FilterWithSlot
 */
export default {
	components: { Input },
	mixins: [logger]
}
</script>
