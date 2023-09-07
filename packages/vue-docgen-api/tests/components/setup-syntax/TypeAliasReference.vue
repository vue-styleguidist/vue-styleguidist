<script setup lang="ts">

type Foo = {
  name: string
}

type Bar = Foo

defineProps<Bar>()

</script>

<template><div></div></template>
