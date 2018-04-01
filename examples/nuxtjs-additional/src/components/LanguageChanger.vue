<template>
  <b-row
    class="w-100">
    <b-col
      class="ml-5 pl-4 mt-4">
      <b-button
        v-for="(locale, index) in $i18n.locales"
        :id="'languageChangeTo' + locale.code"
        :key="index"
        :exact="true"
        :to="switchLocalePath(locale.code)"
        class="mr-2 mb-1">{{ locale.code }}</b-button>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'LanguageChanger',
};
</script>

<style />

<docs>
```jsx
<language-changer></language-changer>
```
</docs>
