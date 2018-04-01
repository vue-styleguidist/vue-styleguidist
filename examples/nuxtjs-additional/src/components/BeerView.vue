<template>
  <div>
    <heading
      :text="$t('beer.title')" />
    <changer
      :button="$t('beer.buttons.change')"
      :change="loadBeer.bind(this)"
      :loader="loadingIndicator">
      <beer-card
        slot="element"
        :image-url="beer.image_url"
        :name="beer.name"
        :description="beer.description"
        :button="$t('beer.buttons.more')"/>
    </changer>
  </div>
</template>

<script>
import BeerCard from '~/components/BeerCard.vue';
import Changer from '~/components/Changer.vue';
import Heading from '~/components/Heading.vue';


/**
 * View that implements Changer
 * and BeerCard component.
 * loadBeer() is passed as prop to Changer.
 */
export default {
  name: 'BeerView',
  components: {
    Changer,
    BeerCard,
    Heading,
  },
  computed: {
    beer() {
      return this.$store.getters['beer/GET'];
    },
    loadingIndicator() {
      return this.$store.getters['loader/GET'];
    },
  },
  created() {
    this.loadBeer();
  },
  methods: {
    /**
     * Run store action.
     * @public
     */
    loadBeer() {
      this.$store.dispatch('beer/LOAD');
    },
  },
};
</script>

<style />

<docs>
```jsx
<beer-view></beer-view>
```
</docs>
