<template>
  <div id="app">
    <Dropdown>
      <Option val="1">hello</Option>
      <Option val="2">goodbye</Option>
    </Dropdown>
    <pre>{{ test }}</pre>
  </div>
</template>

<script>
import Dropdown from "./components/DropDown/DropDown.vue";
import Option from "./components/DropDown/MyOption.vue";

export default {
  name: "App",
  components: {
    Dropdown,
    Option,
  },
  computed: {
    test() {
      return JSON.stringify(Object.keys(Option));
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

