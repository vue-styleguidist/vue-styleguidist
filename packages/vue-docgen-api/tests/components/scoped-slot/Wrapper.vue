<template>
  <div class="modal-footer">
    <!-- @slot Modal footer here -->
    <slot name="footer" v-bind:item="item"/>
  </div>
</template>
