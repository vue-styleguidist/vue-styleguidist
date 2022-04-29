---
'vue-docgen-api': minor
---

`@example` tags can now understand multiline examples

Every tag can now contain multiple lines except for the following:

- `@slot`
- `@ignore`
- `@private`
- `@public`

If one of those tags is placed at the beginning of the TSDocs block, the next lines are still picked up as the description.
