<script setup lang="ts">

type Foo = {
  /**
   * This is name
   */
  name: string
  /**
   * This is age
   */
  age: number
}

type Bar = Foo
type Baz = Bar

defineProps<Baz>()

</script>

<template><div></div></template>
