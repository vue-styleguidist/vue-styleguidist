<template>
	<div class="survey-base">
		<h4>{{ question }}</h4>
		<!--the appropriate input should go here-->
	</div>
</template>
<script>
export default {
	name: 'Base',
	props: ['question']
}
</script>
