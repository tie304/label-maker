<template>
  <div id="labels">
		<ul>
			<li @click="deleteGlobalLabel(label)" class="label tab" v-bind:key="label" v-for="label in labels">{{label}}</li>
		</ul>
    <form v-on:submit="createLabel">
			<label>Add Label</label><br>
      <input class="labels__label-add-input" type="text" v-model="labelName" placeholder="+ label" />
    </form>
		<ul class="labels__current-image-labels">
			<li class="labels__label-element" v-for="fileLabel in getFilesLabels" v-bind:key="fileLabel.file.lastModifed">
				<select @mouseleave="clearHilightedLabel" @mouseover="highlightLabel" class="labels__label-change-select" @change="changeSelectLabel" :data-id="fileLabel.id">
					<option>{{fileLabel.label}}</option>
					<option v-bind:key="label" v-for="label in labels.filter(label => label !== fileLabel.label)">{{label}}</option>   
				</select> <div @click="deleteLabel(fileLabel.id)" class="labels__label-delete">X</div>
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
			this.labelName = ""
		},
		changeSelectLabel(e) {
			this.changeLabel({value: e.target.value, fileId: e.target.dataset.id})
		},
		highlightLabel(e) {
			this.setHighlightedLabel(e.target.dataset.id)
		},
		clearHilightedLabel() {
			this.setHighlightedLabel(null)
		},
		editLabel(e) {
			console.log(e)
		},
		...mapActions(['changeLabel', 'deleteLabel', 'setHighlightedLabel', 'deleteGlobalLabel'])
	}
}
</script>

<style scoped>
	#labels {
		border: 5px solid #000;	
		margin: 1rem;
		max-width: 300px;
		padding: 1rem;
	}
	.tab {
			list-style-type: none;
			padding: 3px;
			margin: 2px;
			background: #BEBEBE;
			color: #fff;
			display: inline-block;
			border-radius: 5px;
			cursor: pointer;
	}
	.labels__label-add-input {
		padding: 5px;
		border: none;
		max-width: 100px;
		margin-right: 1rem;
		outline: none;
		border-bottom: 1px solid #000;
	}
	.labels__current-image-labels {
		list-style: none;
	}
	.labels__label-add-input:focus {
		border-bottom: 3px solid #000;	
	}

	.labels__label-add-input-button {
		padding: 5px;
	}
	.labels__current-image-labels {
		margin-top: 3rem;
	}
	.labels__label-element {
		display: flex;
		align-items: center;
		margin-top: 1rem;
		margin-bottom: 1rem;
	}
	.labels__label-change-select {
		max-width: 100px;
		text-overflow: ellipsis;
	}
	.labels__label-delete {
		cursor: pointer;
		padding: 5px;
		background: red;
		margin-left: 1rem;
		color: #fff;
	}
</style>
