<template>
	<div class="modal-footer">
		<!-- 
      @slot Modal footer
      @binding item an item passed to the footer
		-->
		<slot name="footer" :item="item" />
	</div>
</template>
