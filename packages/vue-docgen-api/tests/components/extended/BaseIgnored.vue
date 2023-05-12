<template>
  <div class="survey-base">
    <h4>{{ ignored_prop }}</h4>
    <!--the appropriate input should go here-->
  </div>
</template>
<script>
export default {
  name: 'BaseIgnored',
  props: ['ignored_prop']
}
</script>
