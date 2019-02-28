<template lang="pug">
button.buttonComponent(@click.prevent='onClick')
  // @slot Use this slot default
  slot
</template>
