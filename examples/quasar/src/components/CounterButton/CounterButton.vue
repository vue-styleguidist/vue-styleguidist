<template>
  <div>
    <q-btn class="button" @click.prevent="increment" unelevated color="primary">
      {{ count }} click to add +1
    </q-btn>
  </div>
</template>

<script>
/**
 * Button that counts how many times it was pressed and exposes a `@public` method to reset itself.
 */
export default {
  name: 'counter-button',
  computed: {
    count () {
      return this.$store.getters.count
    }
  },
  methods: {
  /**
   * Increments the counter. This method is not marked @public and is not visible in the styleguide.
   */
    increment () {
      this.$store.commit('increment')
      /**
       * After increment event
       * @event after
       * @type {number}
       */
      this.$emit('after', this.value)
    }
  }
}
</script>
