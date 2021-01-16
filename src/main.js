import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)

const DOWNLOAD_STRATEGIES = {
	yolo: "yolo"
}

const downloadToFile = (content, filename, contentType) => {
  const a = document.createElement('a');
  const file = new Blob([content], {type: contentType});
  
  a.href= URL.createObjectURL(file);
  a.download = filename;
  a.click();

	URL.revokeObjectURL(a.href);
}

const formatLabelsForYolo = (labelSelectBoxes) => {
	console.log(labelSelectBoxes)
	return "this is yolo"
}

const formatDataByDownloadStrategy = (strategy, data) => {
	switch (strategy) {
		case DOWNLOAD_STRATEGIES.yolo:
			return formatLabelsForYolo(data)
	}	
};


const store = new Vuex.Store({
  state: {
    files: [],// store the actual file objects
		selectedFileUrl: null, //url sting of  selected file
		selectedFile: null, // selected file object
		labelBoxes: [], 
		labels: [],
		datasetName: "",
  },
  mutations: {
    selectFile (state, payload) {
      state.selectedFileUrl = payload.selectedFileUrl
			state.selectedFile = payload.selectedFile
    },
		addLabel(state, payload) {
      state.labels.push(payload)
		},
		createLabelBox(state, payload) {
			state.labelBoxes.push(payload)
		},
		changeLabel(state, payload) {
			let label = state.labelBoxes.findIndex((e) => {
					return e.id == payload.fileId
				});
        state.labelBoxes[label].label = payload.value
			},
		downloadLabels(state, payload) {
			let data = formatDataByDownloadStrategy(payload, state.labelBoxes)
			downloadToFile(data, `${state.datasetName}.txt`, "text/plain")	
		},
		setDatasetName(state, payload) {
			console.log(payload.target.value)
			state.datasetName = payload.target.value
		}
  },
	actions: {
		selectFile(context, payload) {
     context.commit('selectFile', payload)
		},
		addLabel(context, payload) {
			context.commit('addLabel', payload)
		},
		createLabelBox(context, payload) {
      context.commit('createLabelBox', payload)
		},
		changeLabel(context, payload) {
			context.commit('changeLabel', payload)
		},
		downloadLabels(context, payload) {
			context.commit('downloadLabels', payload)
		},
		setDatasetName(context, payload) {
			context.commit('setDatasetName', payload)
		}
	}
})

new Vue({
  render: h => h(App),
	store: store
}).$mount('#app')