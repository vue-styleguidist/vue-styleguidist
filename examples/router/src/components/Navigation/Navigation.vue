<template>
	<nav class="navbar">
		<div v-for="nav_item in mainMenuLinks" :key="nav_item.title" class="nav-links">
			<router-link :to="nav_item.path" exact>{{ nav_item.title }}</router-link>
		</div>
	</nav>
</template>

<script>
export default {
	name: 'Navigation',
	data() {
		return {
			mainMenuLinks: [
				{
					title: 'Overview',
					path: '/'
				},
				{
					title: 'Customers',
					path: '/customers',
					active: false
				},
				{
					title: 'Prospects',
					path: '/prospects',
					active: false
				},
				{
					title: 'Reports',
					path: '/reports',
					active: false
				}
			]
		}
	}
}
</script>

<style scoped>
.navbar {
	display: flex;
	justify-content: flex-start;
	align-items: center;
	cursor: pointer;
}
.nav-links {
	display: flex;
	margin: 0 auto;
}
</style>

<docs lang="md">
Here is an example of what the routing could look like

```jsx
<Navigation />
```
</docs>
