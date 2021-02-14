<template>
  <div id="dataset">
		<div class="dataset__upload-container">
			<label v-if="$store.state.files.length" for="file-upload" id="dataset-file-upload">Add New Images</label>
			<input v-if="$store.state.files.length" type="file" id="file-upload" @change="addNewImages($event)" multiple hidden>
		</div>
		<DatasetImageThumbnail v-for="file in $store.state.files" v-bind:key="file.name" v-bind:file="file" />
  </div>
  
</template>

<script>
import DatasetImageThumbnail from "./DatasetImage.vue"

export default {
  name: 'Dataset',
  components: {
   DatasetImageThumbnail
  },
  data: function() {
   return {}
  },
  methods: {
		addNewImages(e) {
			e.target.files.forEach((file) => {
				this.$store.state.files.push(file)
			})	
		},

  },
  computed: {
   urlStringBlob: function() { 
     return this.$store.state.files.map((file) => {
       return URL.createObjectURL(file)
     });
   }
  }
}
</script>

<style scoped>
 #dataset {
  display: flex;
  flex-direction: column;
  padding: 1rem;
	overflow: auto;
	max-width: 20rem;
	height: 90vh;
 }
.dataset__upload-container {
	margin-bottom: 2rem;
	margin-top: 1rem;
}
 #dataset-file-upload {
	padding: 1rem;
	border: 1px solid var(--tertiary-color);
	color: var(--tertiary-color);
	cursor: pointer;
 }
 </style>
