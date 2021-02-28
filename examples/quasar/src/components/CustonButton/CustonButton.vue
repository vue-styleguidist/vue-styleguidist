<template>
  <!--
    default click of button
    @event click
  -->
  <q-btn :color="color" @click="$emit('click')" unelevated>
    <q-icon :name="icon" v-if="icon" />
    {{label}}
    <slot></slot>
  </q-btn>
</template>

<script>
export default {
  name: 'custon-buttom',
  props: {
    /**
       * The color for the button.
       * Color palette of quasar
       */
    color: {
      type: String,
      default: 'primary'
    },
    /**
       * Optional icon for the button.
       * Use material-icons
       */
    icon: {
      type: String
    },
    /**
       * The label for the button.
       */
    label: {
      type: String
    }
  }
}
</script>

<style>

</style>
