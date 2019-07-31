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
Example can be their own file. Use the following syntax.

````markdown
```[import](./_radioExample.vue)
this text is going to be ignored
```
````

```[import](./_radioExample.vue)
this text is going to be ignored
```

They can be imported from anywhere from your source. 
To keep your code tidy and the navigation easy, keep then in the same directory as your component.

````markdown
```[import](./examples/example.js)
this text is going to be ignored
```
````

```[import](./examples/example.js)
this text is going to be ignored
```
</docs>