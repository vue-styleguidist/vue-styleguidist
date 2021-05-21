import { Component, Vue, Prop } from 'vue-property-decorator'

/** Test Component A */
@Component
export class ComponentA extends Vue {
	/** Component Value */
	@Prop(String)
	value!: string
}

/** Test Component B */
@Component
export class ComponentB extends Vue {
	/** Component B Value */
	@Prop(String)
	value!: string
}
