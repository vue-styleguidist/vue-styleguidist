<template>
  <b-row
    class="w-75  pt-3">
    <b-col
      cols="12"
      class="ml-4 p-2 pl-5">
      <h3>{{ text }}</h3>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: 'Heading',
  props: {
    text: {
      type: String,
      default: '',
    },
  },
};
</script>

<style/>

<docs>
```jsx
<heading
  :text="$t('beer.title')"/>
```
</docs>
