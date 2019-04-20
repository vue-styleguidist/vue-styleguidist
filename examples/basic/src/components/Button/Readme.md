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
