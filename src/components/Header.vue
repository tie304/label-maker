<template>
  <div class="header">
    <input v-on:change="setDatasetName($event)" placeholder="dataset-name" />
		<button v-on:click="downloadLabels('yolo')">Export Labels</button>
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
  padding: 2rem;
	color: #fff; 
	background: #000;
	display: flex;
}
</style>
