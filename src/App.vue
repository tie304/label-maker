<template>
    <div id="app">
        <Header />
        <input v-if="!$store.state.files.length" type="file" id="file-upload" @change="imageUpload($event)" multiple>
        <div v-if="$store.state.files.length" class="app-dash">
        <Dataset />
        <Editor />
        <Labels />
      </div>
    </div>
</template>

<script>
import Header from './components/Header.vue'
import Dataset from "./components/Dataset.vue"
import Editor from "./components/Editor.vue"
import Labels from "./components/Labels.vue"
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    Header,
    Dataset,
    Editor,
    Labels
  },
  methods: {
    imageUpload(e) {
      e.target.files.forEach((file) => {
	this.$store.state.files.push(file)
      });
    },
		computed: {
      ...mapState(['files'])
		}
  }
}
</script>

<style>

* {
  padding: 0;
  margin: 0;
}

html {
   font-size: 62.5%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  
}
.app-dash {
    display: flex;
    justify-content: space-between;

}
</style>
