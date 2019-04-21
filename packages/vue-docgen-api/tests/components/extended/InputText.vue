<template>
  <div>
    <!--How to include the question here???-->
    <input :placeholder="placeholder">
  </div>
</template>
<script>
import Base from './Base.vue'

/**
 * Description InputText
 */
export default {
	name: 'InputText',
	extends: Base,
	props: ['placeholder']
}
</script>
