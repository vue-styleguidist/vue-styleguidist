<template>
  <b-row
    class="p-5 w-100">
    <b-col
      cols="12"
      lg="3"
      class="pl-4 pb-5">
      <b-button
        @click="change">{{ button }}</b-button>
    </b-col>
    <b-col
      cols="12"
      lg="9"
      class="mx-auto">
      <b-col
        v-if="loader"
        :cols="12"
        :lg="8"
        class="text-center">
        <icon
          name="spinner"
          spin
          scale="3"/>
      </b-col>
      <b-col
        v-else>
        <!-- @slot Use this slot element -->
        <slot
          name="element"/>
      </b-col>
    </b-col>
  </b-row>
</template>

<script>
import 'vue-awesome/icons/spinner';
import Icon from 'vue-awesome/components/Icon.vue';

export default {
  name: 'Changer',
  components: {
    Icon,
  },
  props: {
    button: {
      type: String,
      default: '',
    },
    change: {
      type: Function,
      default: (event) => {
        // eslint-disable-next-line
        alert('You have clicked me!', event.target);
      },
    },
    loader: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style />

<docs>
```jsx
<changer
  :button="$t('beer.buttons.change')"></changer>
```
</docs>
