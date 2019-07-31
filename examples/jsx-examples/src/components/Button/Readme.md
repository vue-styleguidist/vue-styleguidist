If you wish to, you can use JSX in your examples. Make sure you set the "jsxInExamples" flag to true in your `styleguide.config.js`

A first example with a jsx file

```jsx
import { all as dogNames } from 'dog-names'

// You can also use 'exports default {}' style module exports.
export default {
  data() {
    return { numClicks: 0, dogName: dogNames[0] }
  },
  render() {
    return (
      <div staticClass="wrapper">
        <Button native-on-click={this.pushButton}>Push Me</Button>
        <hr />
        <p staticClass="text-name">Next Dog Name: {this.dogName}</p>
      </div>
    )
  },
  methods: {
    pushButton() {
      this.numClicks += 1
      this.dogName = dogNames[this.numClicks]
    }
  }
}
```

You can as well use Single File Components with JSX. This would allow you to style your JSX examples.

```vue
<script>
import { all as dogNames } from 'dog-names'

// You can also use 'exports default {}' style module exports.
export default {
  data() {
    return { numClicks: 0, dogName: dogNames[0] }
  },
  render() {
    return (
      <div staticClass="wrapper">
        <Button native-on-click={this.pushButton}>Push Me</Button>
        <hr />
        <p staticClass="text-name">Next Dog Name: {this.dogName}</p>
      </div>
    )
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
  background-color: #eeeeee;
  padding: 11px;
}
</style>
```

A minima, one is supposed to do that

```jsx
new Vue({
  render() {
    return <Button>test</Button>
  }
})
```

or this

```jsx
export default {
  render() {
    return <Button>test</Button>
  }
}
```

it works with spread too

```[import](./_example.jsx)
...ignored text...
```
