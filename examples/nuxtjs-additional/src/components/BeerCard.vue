<template>
  <div>
    <b-card
      bg-variant="dark"
      text-variant="white">
      <b-row>
        <b-col
          cols="3">
          <img
            :src="imageUrl"
            class="pl-3 beer__content--img"
            alt="beer-image"
            @error="onError">
        </b-col>
        <b-col
          cols="12"
          sm="8"
          lg="8">
          <b-card-body>
            <h4 class="card-title">{{ name }}</h4>
            <p class="card-text">{{ description }}</p>
            <b-button>{{ button }}</b-button>
          </b-card-body>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import emptyImage from '@/assets/images/noimage.svg';

export default {
  name: 'BeerCard',
  props: {
    imageUrl: {
      type: String,
      default: emptyImage,
    },
    name: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    button: {
      type: String,
      default: '',
    },
  },
  methods: {
    onError(e) {
      e.target.src = emptyImage;
    },
  },
};
</script>

<style>
.beer__content--img {
  max-width: 120px;
  max-height: 360px;
}
</style>

<docs>
```jsx
<beer-card
  :imageUrl="'https://images.punkapi.com/v2/keg.png'"
  :name="'Buzz'"
  :description="'A crisp and bitter IPA brewed ' +
    'with English and American hops. A small batch brewed only once.'"
  :button="$t('beer.buttons.more')"/>
```
</docs>
