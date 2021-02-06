<template>
    <div id="app">
        <Header />
				<label v-if="!$store.state.files.length"  for="file-upload" id="file-upload-label">No files in dataset</label>
        <input v-if="!$store.state.files.length" type="file" id="file-upload" @change="imageUpload($event)" multiple hidden>
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
import { mapActions, mapState } from 'vuex'

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
				this.addFile(file)	
      });
    },
		...mapActions(['addFile']),
		computed: {
      ...mapState(['files'])
		}
  }
}
</script>

<style>
:root {
  --primary-color: #000;
  --secondary-color: #ffffff;
}

* {
  padding: 0;
  margin: 0;
}

html {
   font-size: 62.5%;
}
body {
	background-color: var(--primary-color)
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
#file-upload-label {
	background-color: var(--color-secondary);

  color: var(--primary-color);
	position: absolute;
	left: 50%;
	top: 25%;
	transform: translate(-50%, -50%);
  padding: 10rem;
  font-family: sans-serif;
  border-radius: 0.3rem;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
