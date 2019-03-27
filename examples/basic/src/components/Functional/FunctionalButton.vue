<template functional>
  <!-- @prop {string} id name attribute of the button -->
  <button :name="props.id" style="background:pink">
    <!-- @slot name of the button -->
    <slot/>
  </button>
</template>

<docs>
```vue
<functional-button id="test">
    hello
</functional-button>
```
</docs>
