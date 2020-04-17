<template>
	<div>
		HELLO
	</div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'

interface Book {
	name: string
	desc: string
}

interface KeyedBook<K> extends Book {
	key: K
}

@Component
export default class SomeComponent extends Vue {
	/** Description for propA */
	@Prop({ default: 3 })
	readonly propA!:
		| 'string literal'
		| 3
		| Book
		| string[]
		| number[]
		| Book[]
		| Array<Book>
		| KeyedBook<string>

	/** Description for propB */
	@Prop({ default: 4 })
	readonly propB!: 'string literal' & 3 & Book & string[] & number[] & Book[] & Array<Book>

	/**
	 * Description for method.
	 *
	 * Don't forget to add an `@public` doclet.
	 * @public
	 */
	public onClick(name: string[], hello: Array<Book>) {
		/**
		 * Success event when we click.
		 * @property {string} name description of name.
		 * @property {boolean} success always true.
		 */
		this.$emit('success', { name, success: true })
	}
}
</script>

<docs>
```jsx
<SomeComponent />
```
</docs>
