<template>
  <div id="dataset">
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
 }
 </style>
