<template>
<transition name="Modal" v-if="showModal">
	<div class="modal-mask">
		<div class="modal-wrapper">
			<div class="modal-container">
				<div class="modal-head">
					<!-- @slot Use this slot header -->
					<slot name="head"></slot>
				</div>
				<div class="modal-body">
					<!-- @slot Use this slot body -->
					<slot name="body"></slot>
				</div>
			</div>
		</div>
	</div>
</transition>
</template>

<script>
/**
 * Modal example [modal-component](https://vuejs.org/v2/examples/modal.html).
 * @author [Vue](https://vuejs.org/v2/examples/modal.html)
 */
export default {
	name: 'Modal',
	props: {
		/**
		 * Show modal
		 */
		showModal: {
			type: Boolean,
			default: false
		}
	}
}
</script>

<style scope>
.modal-mask {
	position: fixed;
	z-index: 9998;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	display: table;
	transition: opacity 0.3s ease;
}

.modal-wrapper {
	display: table-cell;
	vertical-align: middle;
}

.modal-container {
	width: 300px;
	margin: 0px auto;
	padding: 20px 30px;
	background-color: #fff;
	border-radius: 2px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
	transition: all 0.3s ease;
	font-family: Helvetica, Arial, sans-serif;
}

h3 {
	margin-top: 0;
	color: #42b983;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.Modal-enter {
	opacity: 0;
}

.Modal-leave-active {
	opacity: 0;
}

.Modal-enter .modal-container,
.Modal-leave-active .modal-container {
	-webkit-transform: scale(1.1);
	transform: scale(1.1);
}
</style>
