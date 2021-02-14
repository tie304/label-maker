<template>
	<div class="dataset-container">
		<span class="label-count">{{totalLabels}}</span>
		<img :title="file.name" :class="{ active: isSelected}" v-on:click="selectFile({selectedFileUrl: urlStringBlob, selectedFile: file})" :id="file.name" class="dataset__thumbnail" :src="urlStringBlob">
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DatasetImageThumbnail',
  props: ['file'],
  data: function() {
    return {
      urlBlob: null
    }
  },
  methods: {
    ...mapActions(['selectFile'])
  },
  computed: {
    urlStringBlob: function () {
			let urlBlob = URL.createObjectURL(this.file)
      return urlBlob
    },
		totalLabels: function( ){
			let totalLabels = 0;
			this.labelBoxes.forEach((label) => {
				if (label.file.name === this.file.name) {
					totalLabels += 1
				}
			});
			return totalLabels;
		},
    isSelected: function() {
      return this.selectedFileUrl == this.urlStringBlob
    },
    ...mapState(['selectedFileUrl', 'labelBoxes'])
   }
}
</script>

<style scoped>
.dataset__thumbnail {
	max-height: 100px;
	padding: 1rem;
	cursor: pointer;
	width: 16rem;
	background-color: var(--secondary-color);
}
.dataset__thumbnail.active {
	background: var(--quaternary-color);
}

.dataset-container {
	position: relative;
}
.label-count {
	padding: 5px;
	background: var(--tertiary-color);
	position: absolute;
}

</style>
