```vue
<div>
  <CounterButton ref="count"/>
  <Button size="small" @click="() => {$refs.count.set(0)}">
    Reset
  </Button>
</div>
```
