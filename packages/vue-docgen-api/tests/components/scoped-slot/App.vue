<template>
  <div slot-scope="row" class="list-item1">
    {{row.item.text}}
    <!-- @slot text slot here -->
    <slot name="text" />
  </div>
</template>