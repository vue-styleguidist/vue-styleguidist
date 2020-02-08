<template>
  <List :items="listItems">
    <div
      slot-scope="row"
      class="list-item1"
    >
      {{ row.item.text }}
      <!-- 
				@slot Menu Item footer 
				@binding {object} icon icon of the menu item
				@binding {string} text text of the menu item
			-->
      <slot
        name="test"
        :icon="row.item.icon"
        :text="row.item.text"
      />
    </div>
  </List>
</template>

<script>
import List from './_List.vue'

export default {
	name: 'ScopedSlot',
	components: {
		List
	},
	data() {
		return {
			listItems: [
				{ text: 'First item', icon: 'fa fa-user' },
				{ text: 'Second item', icon: 'fa fa-copy' },
				{ text: 'Third item', icon: 'fa fa-cut' }
			]
		}
	}
}
</script>