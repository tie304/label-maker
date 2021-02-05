import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'

Vue.config.productionTip = false
Vue.use(Vuex)
// defalt size for the editor
export const EDITOR_CANVAS_MAX_SIZE = {
	width: 1000,
	height: 600
}

export const EDITOR_ZOOM_INC = 0.1

const DOWNLOAD_STRATEGIES = {
	yolo: "yolo" // class x_center y_center width height
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
	let yoloLabels = []
	labelSelectBoxes.forEach((label) => {
		console.log(label.x, label.y, label.width, label.height)
		//Center x = x + 1/2 of width
		// Center y = y + 1/2 of height 
		let YCenter = Math.round(label.y + (label.height / 2))
		let XCenter = Math.round(label.x + (label.width / 2))
		// because canvas and image is different sizes in size need to transpose
		let ratioH = label.naturalImageHeight / label.canvasHeight
		let ratioW = label.naturalImageWidth / label.canvasWidth

		let transposedXCenter = Math.round(XCenter * ratioW)
		let transposedYCenter = Math.round(YCenter * ratioH)

		let transposedWidth = Math.round(label.width * ratioW)
		let transposedHeight = Math.round(label.height * ratioH)


		yoloLabels.push({
			label: label.label,
			file_name: label.file.name,
			x_center: transposedXCenter,
			y_center: transposedYCenter,
			width: transposedWidth,
			height: transposedHeight
		})
	});

	return yoloLabels
}

const formatDataByDownloadStrategy = (strategy, data) => {
	switch (strategy) {
		case DOWNLOAD_STRATEGIES.yolo:
			return JSON.stringify(formatLabelsForYolo(data))
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
		highlightedLabel: null
  },
  mutations: {
    selectFile (state, payload) {
      state.selectedFileUrl = payload.selectedFileUrl
			state.selectedFile = payload.selectedFile
    },
		addFile(state, payload) {
			state.files.push(payload)
		},
		addLabel(state, payload) {
      state.labels.push(payload)
		},
		setHighlightedLabel(state, payload) {
			state.highlightedLabel = payload
		},
		createLabelBox(state, payload) {
			state.labelBoxes.push(payload)
		},
		deleteLabel(state, payload) {
			let labels = state.labelBoxes.filter((label) => {
				return label.id != payload
			});
			state.labelBoxes = labels	
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
			state.datasetName = payload.target.value
		},
		deleteGlobalLabel(state, payload) {
			let labels = state.labels.filter((label) => {
				return label != payload
			});
			state.labels = labels
		}
  },
	actions: {
		selectFile(context, payload) {
     context.commit('selectFile', payload)
		},
		addFile(context, payload) {
			context.commit('addFile', payload)
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
		},
		setHighlightedLabel(context, payload) {
			context.commit('setHighlightedLabel', payload)
		},
		deleteLabel(context, payload) {
			context.commit("deleteLabel", payload)
		},
		deleteGlobalLabel(context, payload) {
			if (confirm("Delete label? Selected labels will remain.")) {
				context.commit("deleteGlobalLabel", payload)
			}
		}
	}
})

new Vue({
  render: h => h(App),
	store: store
}).$mount('#app')
