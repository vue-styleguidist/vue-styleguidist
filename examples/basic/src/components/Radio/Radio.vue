<template>
  <div>
    <template v-for="op in options">
      <input type="radio" :value="op.value" name="hello" :key="op.value" />
      <label :for="op.value" :key="`${op.value}-label`">{{op.text}}</label>
    </template>
  </div>
</template>
<script>
export default {
	props: {
		options: Array
	}
}
</script>

<docs>
You can have the example in remote files too.

````markdown
```[import](./_radioExample.vue)
this text is going to be ignored
```
````

```[import](./_radioExample.vue)
this text is going to be ignored
```

Or you can try this

```[import](./examples/example.js)
this text is going to be ignored
```
</docs>