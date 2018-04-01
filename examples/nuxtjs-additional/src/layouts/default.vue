<template>
  <div>
    <language-changer />
    <nuxt/>
  </div>
</template>

<script>
import LanguageChanger from '~/components/LanguageChanger.vue';

export default {
  name: 'Main',
  components: {
    LanguageChanger,
  },
};
</script>

<style>
.nuxt-progress {
  display: none;
}
</style>
