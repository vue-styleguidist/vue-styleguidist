<template>
  <q-page class="flex flex-center">
    <custon-button color="green" icon="edit" label="Editar" />
    <counter-button />
  </q-page>
</template>

<script>
import CustonButton from 'src/components/CustonButton/CustonButton.vue'
import CounterButton from 'src/components/CounterButton/CounterButton.vue'

export default {
  name: 'PageIndex',
  components: {
    CustonButton,
    CounterButton
  }
}
</script>
