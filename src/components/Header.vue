<template>
  <div class="header">
		<img class="logo" src="@/assets/logo.png" />
    <!-- <input v-on:change="setDatasetName($event)" placeholder="dataset-name" />
			<button v-on:click="downloadLabels('yolo')">Export Labels</button> -->
		</div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Header',
	data: function() {
		return {
		}
	},
	methods: {
	...mapActions(['downloadLabels', 'setDatasetName'])
	}
 }

</script>

<style scoped>
.header {
  padding: 1rem;
	color: var(--tertiary-color); 
	background: var(--secondary-color);
	display: flex;
}
.logo {
	height: 50px;
}
</style>
