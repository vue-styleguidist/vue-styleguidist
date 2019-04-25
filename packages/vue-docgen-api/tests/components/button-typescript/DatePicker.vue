<template>
  <div class="input-group date">
    <input
      ref="inputDate"
      type="text"
      :data-value="date"
      :value="date"
      class="form-control"
      :style="`background: ${color}`"
      :disabled="disabled"
    >
    <span class="input-group-addon" :style="`background: ${color}`">
      <span class="glyphicon glyphicon-calendar"/>
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class DatePicker extends Vue {
	@Prop({ default: '' })
	date: any
	@Prop({ default: '' })
	format: any
	@Prop({ default: '' })
	color: any
	@Prop({ default: false })
	disabled: any

	initDatepicker() {
		;(<any>window).$(this.$el).datetimepicker({
			locale: 'nl',
			format: this.format ? this.format : 'DD-MM-YYYY',
			defaultDate: new Date()
		})
		this.$emit('update:date', (<any>this.$refs.inputDate).value)
	}

	mounted() {
		this.initDatepicker()
		;(<any>window).$(this.$el).on('dp.change', () => {
			this.$emit('update:date', (<any>this.$refs.inputDate).value)
		})
	}
}
</script>
