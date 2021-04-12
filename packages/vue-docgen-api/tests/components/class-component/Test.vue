<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MyMixin from '../../mixins/ts'

@Component
export default class MyButton extends Mixins(MyMixin) {}
</script>