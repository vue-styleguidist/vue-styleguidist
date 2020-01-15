Basic button:

```jsx
<BestButton>Push Me</BestButton>
```

Big pink button and small blue button:

```vue
<BestButton size="large" color="deeppink">
  Click Me
</BestButton>
<br />
<BestButton size="small" color="blue">
  Second button
</BestButton>
```

And you _can_ **use** `any` [Markdown](http://daringfireball.net/projects/markdown/) here.

Fenced code blocks with `vue`, `js`, `jsx` or `javascript` languages are rendered as a interactive playgrounds:

```jsx
<BestButton>Push Me</BestButton>
```

You can also use the Single File Component Format

```vue
<template>
    <div class="wrapper">
        <BestButton @click.native="pushButton">Push Me</BestButton>
        <hr />
        <p class="text-name">Next Dog Name: {{ dogName }}</p>
        <p class="text-name">Count: {{ count }}</p>
    </div>
</template>
<script>
const dogNames = require('dog-names').all

// You can also use 'exports.default = {}' style module exports.
export default {
  data() {
    return { numClicks: 0, dogName: dogNames[0] }
  },
  methods: {
    pushButton() {
      this.numClicks += 1
      this.dogName = dogNames[this.numClicks]
    }
  }
}
</script>
<style scoped>
.wrapper {
  padding: 10px;
}
.text-name {
  color: red;
}
</style>
```

another example with the `new Vue({})` format

```js
const countArray = require('~/store/models/data').default
const count = countArray()

// You can also use 'exports.default = {}' style module exports.
new Vue({
  data() {
    return { numClicks: 0 }
  },
  computed: {
    count() {
      return count[this.numClicks] || this.numClicks
    }
  },
  template: `
    <div>
      <BestButton @click.native="numClicks++">Push Me</BestButton>
      <hr />
      <p class="text-name">Count: {{ count }}</p>
    </div>
  `
})
```
