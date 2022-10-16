import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class MyMixin extends Vue {
	/**
	 * Some property which should be shown on a doc page
	 */
	@Prop({ default: '', type: String })
	public readonly someProp!: string
}
