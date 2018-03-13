```jsx
<div>
  <CounterButton ref="count"/>
  <Button size="small" :onClick="() => {this.$refs.count.set(0)}">
    Reset
  </Button>
</div>
```
