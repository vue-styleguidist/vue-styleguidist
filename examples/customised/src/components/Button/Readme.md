Basic button:

```jsx
<Button>Push Me</Button>
```

Big pink button:

```jsx
<Button size="large" color="deeppink">
  Click Me
</Button>
```

And you _can_ **use** `any` [Markdown](http://daringfireball.net/projects/markdown/) here.

Fenced code blocks with `vue`, `js`, `jsx` or `javascript` languages are rendered as a interactive playgrounds:

```jsx
<Button>Push Me</Button>
```

You can also use the Single File Component Format

```vue
<template>
    <div>
        <Button @click.native="pushButton">Push Me</Button>
        <hr />
        <p>Next Dog Name: {{ dogName }}</p>
    </div>
</template>
<script>
const dogNames = require('dog-names').all

// You can also use 'exports.default = {}' style module exports.
export default {
  name: 'ButtonExample',
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
```
