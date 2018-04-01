<template>
  <div>
    <b-card-group deck>
      <b-card
        :title="name"
        :header="head"
        :footer="foot"
        header-tag="header"
        footer-tag="footer">
        <p
          v-for="(description, key) in descriptions"
          :key="key"
          class="card-text">
          {{ description }} </p>
        <b-button
          href=""
          variant="primary"> {{ button }} </b-button>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  name: 'CharacterCard',
  props: {
    name: {
      type: String,
      default: '',
    },
    descriptions: {
      type: Array,
      default: () => [],
    },
    button: {
      type: String,
      default: '',
    },
    head: {
      type: String,
      default: '',
    },
    foot: {
      type: String,
      default: '',
    },
  },
};
</script>

<style />

<docs>
```jsx
<character-card
  :name="'Luke Skywalker'"
  :button="$t('character.buttons.more')"/>
```
</docs>
