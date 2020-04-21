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
 * @displayName notnot
 */
export default {
	components: { Input },
	mixins: [logger]
}
</script>
