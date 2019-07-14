# vue-inbrowser-compiler

Compile vue components code into vue components objects inside of your browser

## install

```bash
yarn add vue-inbrowser-compiler
```

## usage

This library is meant to help write components for vue that can be edited through text.

### compile

Compiles a string of pseudo javascript code written in es2015. It returns the body of a function as a string. Once you execute the function, it will return a VueJS component.

```js
import { compile } from 'vue-inbrowser-compiler'

/**
 * render a component
 */
function getComponent(code) {
  const conpiledCode = compile(
    code,
    // pass in config options to buble to set up the output
    {
      target: { ie: 11 }
    }
  )
  const func = new Function(code)
  return func()
}
```

The formats of the code here are the same as vue-live and vue-styleguidist

#### pseudo jsx

Most common use case is a simple vue template.

```html
<Button color="blue">Test This Buttton</Button>
```

will be transformed into

```js
return {
  template: '<Button color="blue">Test This Buttton</Button>'
}
```

A more advanced use case if you want to use variables

```jsx
// initialize variables here and use them below
let show = true
let today = new Date();

// starting from the first line that starts with a <tag>,
// the rest is considered a template
<input type="checkbox" v-model="show">
<date-picker
  style="text-align:center;"
  v-if="show"
  :value="today"/>
```

will turn into

```js
let show = true
let today = new Date();

return {
    data(){
        return{
            show: show,
            today: today
        }
    }
    template: `<input type="checkbox" v-model="show">
<date-picker
  style="text-align:center;"
  v-if="show"
  :value="today"/>`
}
```

#### Vue apps

A simple way to make it explicit

```js
new Vue({
  template: `
<div>
  <input v-model="value" type="checkbox">
  <h1 v-if="value">I am checked</h1>
</div>`,
  data() {
    return {
      value: false
    }
  }
})
```

#### Single File Components

```html
<template>
  <div class="hello">
    <h1>Colored Text</h1>
    <button>{{ msg }}</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: "Push Me"
    };
  }
};
</script>

<style>
.hello {
  text-align: center;
  color: #900;
}
</style>
```

### isCodeVueSfc

Detects if the code given corresponds to a VueJS [Single File Component](https://vuejs.org/v2/guide/single-file-components.html). If there is a `<template>` or a `<script>` tag, it will return true, otherwise return false.

```js
import { isCodeVueSfc } from 'vue-inbrowser-compiler'

if (isCodeVueSfc(code)) {
  doStuffForSFC(code)
} else {
  doStuffForJSFiles(code)
}
```

### adaptCreateElement

### addScopedStyle
