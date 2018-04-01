<template>
  <div>
    <heading
      :text="$t('character.title')" />
    <changer
      :button="$t('character.buttons.change')"
      :change="loadCharacter.bind(this)"
      :loader="loader">
      <div
        slot="element">
        <character-card
          :name="character.name"
          :descriptions="character.descriptions"
          :button="$t('character.buttons.more')"/>
      </div>
    </changer>
  </div>
</template>

<script>
import CharacterCard from '~/components/CharacterCard.vue';
import Changer from '~/components/Changer.vue';
import Heading from '~/components/Heading.vue';

/**
 * View that implements Changer
 * and CharacterCard component.
 * loadCharacter() is passed as prop to Changer.
 */
export default {
  name: 'CharacterView',
  components: {
    Changer,
    CharacterCard,
    Heading,
  },
  data() {
    return {
      character: {},
      loader: false,
      id: 0,
    };
  },
  created() {
    this.loadCharacter();
  },
  methods: {
    /**
     * Get Star Wars character
     * @public
     */
    async loadCharacter() {
      this.loader = true;
      const character = await this.$axios
        .$get(`https://swapi.co/api/people/${this.id += 1}/?format=json`);
      this.character =
        this.createCharacterDescriptions(character);
      this.loader = false;
    },
    createCharacterDescriptions(input) {
      const character = Object.assign({}, input);
      character.descriptions = [
        `${this.$t('character.description.height')}: ${character.height}`,
        `${this.$t('character.description.mass')}: ${character.mass}`,
        `${this.$t('character.description.gender')}: ${character.gender}`,
      ];
      return character;
    },
  },
};
</script>

<style />

<docs>
```jsx
<character-view></character-view>
```
</docs>
