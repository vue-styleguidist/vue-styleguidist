<template>
  <div>
    <beer-view />
    <character-view />
  </div>
</template>

<script>
import BeerView from '~/components/BeerView.vue';
import CharacterView from '~/components/CharacterView.vue';

export default {
  name: 'Page',
  components: {
    BeerView,
    CharacterView,
  },
};
</script>

<style>

</style>
