<template>
  <div></div>
</template>

<script>
export default {
  model: {
    prop: 'checked',
    event: 'checked:update'
  },
  props: {
    checked: {
      type: Boolean
    }
  }
};
</script>
