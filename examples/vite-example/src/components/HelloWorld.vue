<script lang="ts">
export default {
  props: {
    msg: {
      type: String,
      default: 'Hello World!'
    }
  }
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You've successfully created a project with
      <a target="_blank" href="https://vitejs.dev/">Vite</a> +
      <a target="_blank" href="https://v3.vuejs.org/">Vue 3</a>.
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-size: 3rem;
  font-weight: normal;
  margin: 0;
}
</style>
