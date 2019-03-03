import { Component, Prop, Vue } from 'vue-property-decorator'

/**
 * This is an example of creating a reusable button component and using it with external data.
 * @author [Rafael](https://github.com/rafaesc92)
 * @version 1.0.5
 */
@Component
export default class MyComponent extends Vue {
	public aHiddenData: string = ''

	/**
	 * An example of a property typed through the decorators arguments
	 */
	@Prop({ type: String })
	public propNoType = ''

	/**
	 * An example of a property typed through the annotation
	 */
	@Prop() public propA: number = 0

	/**
	 * A prop with a default value
	 */
	@Prop({ default: 'default value' })
	public propB: string = 'hello'

	/**
	 * A prop with a hybrid type
	 */
	@Prop() public propC: string | boolean = false

	/**
	 * method testing
	 * @public
	 */
	public onClick(a: string) {
		/**
		 * Success event when we click
		 */
		this.$emit('success', a)
	}
}
