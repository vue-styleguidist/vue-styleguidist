# Dashed style named component

By default it will take the dashed notation

```vue
<template>
  <my-button>
    Push Me
  </my-button>
</template>

<script>
export default {}
</script>
```

or name changed with the explicitly required instance

```jsx
const Vue = require('vue').default
const MyButton = require('./my-button.vue').default
Vue.component('MyButton', MyButton)

<MyButton>Push Me</MyButton>
```
