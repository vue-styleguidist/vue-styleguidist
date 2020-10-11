<template functional>
	<div class="vue-live-wrapper">
		<div class="vue-live-preview">
			<slot name="preview"></slot>
		</div>
		<div class="vue-live-editor">
			<span class="lang">{{ props.lang }}</span>
			<slot name="editor"></slot>
		</div>
	</div>
</template>
<style>
.vue-live-wrapper{
	margin: 20px 0;
	border-radius: 6px;
	overflow: hidden;
    box-shadow: 0 0 5px -3px rgb(0, 0, 0, 0.8);
}
.vue-live-preview{
    padding:10px;
}
.vue-live-editor{
	position: relative;
	background-color:#263238;
	padding: 12px 16px;
	font-family: "DM Mono", monospace;
	line-height: 1.5em;
    font-size: 1em;
}
.lang{
    position: absolute;
	right: 10px;
	line-height: 1em;
}
</style>