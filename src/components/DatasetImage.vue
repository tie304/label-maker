<template>
	<img :class="{ active: isSelected}" v-on:click="selectFile({selectedFileUrl: urlStringBlob, selectedFile: file})" :id="file.name" class="dataset__thumbnail" :src="urlStringBlob">
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
    isSelected: function() {
      return this.selectedFileUrl == this.urlStringBlob
    },
    ...mapState(['selectedFileUrl'])
   }
}
</script>

<style scoped>
.dataset__thumbnail {
   max-height: 100px;
   padding: 1rem;
   cursor: pointer;
   background-color: #333;
 }
 .dataset__thumbnail.active {
   background: #000;
 }

</style>
