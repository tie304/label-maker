<template>
  <div id="labels">
    <form v-on:submit="createLabel">
      <input type="text" v-model="labelName" placeholder="add label" />
			<button type="submit">add label</button>
    </form>
		<hr>
		<ul>
			<li v-for="fileLabel in getFilesLabels" v-bind:key="fileLabel.file.lastModifed">
				<select @change="changeSelectLabel" :data-id="fileLabel.id">
					<option>{{fileLabel.label}}</option>
					<option v-bind:key="label" v-for="label in labels.filter(label => label !== fileLabel.label)">{{label}}</option>   
				</select>
			</li>
		</ul>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Labels',
	data: function() {
   return {
      labelName: ""
    }
	},
	computed: {
		getFilesLabels() {
			return this.labelBoxes.filter((label) => {
				return label.file.name == this.selectedFile.name
			});
		},
		getLabelsExceptSelected: function(selectedLabel) {
			return this.labels.filter(label => label !== selectedLabel)
		},
    ...mapState(['labels', 'labelBoxes', 'selectedFile'])
	},
		methods: {
    createLabel(e) {
      e.preventDefault()
			if (this.labels.includes(this.labelName)) {
        alert("No duplicate labels alowed")
				return 
			} else if (this.labelName == "") {
        return 
			} 
			this.$store.dispatch('addLabel', this.labelName)
		},
		changeSelectLabel(e) {
			this.changeLabel({value: e.target.value, fileId: e.target.dataset.id})
		},
		...mapActions(['changeLabel'])
	}
}
</script>

<style scoped>
</style>
