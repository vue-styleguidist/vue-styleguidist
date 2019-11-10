Basic Input

```js
  const setting = {
    regExp: /^[0\D]*|\D*/g, // Match any character that doesn't belong to the positive integer
    replacement: '',
    val: '223'
  }
  const executeFire = function(event){
    alert(event)
  }

  <Input
      v-model="setting.val"
      class="your-class-name"
      :regExp="setting.regExp"
      :replacement="setting.replacement"
      @fire="executeFire"
    ></Input>
```
