<template>
  <div id="editor">
    <canvas @mouseup="mouseUp" v-on:mousemove="updateCoordinates" @mousedown="mouseDown" ref="editor-canvas" id="editor-canvas"></canvas>
		<div v-if="labelPopup" class="label-popup" ref="label-popup" :style="{top: clientY + 'px', left: clientX + 'px'}">			
				<select name="labels" @change="selectLabel" id="labels-select">
					<option selected disabled>Select Label</option>
				label-box here
					<option v-bind:key="label" v-for="label in labels">{{label}}</option>   
				</select>
		</div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { v4 as uuidv4 } from 'uuid';
import { EDITOR_CANVAS_MAX_SIZE } from '../main.js';

export default {
  name: 'Editor',
	data: function() {
    return {
			selectedLabel: {
				x: null,
				y: null,
				width: null,
				height: null
			},
			canvasMaxHeight: EDITOR_CANVAS_MAX_SIZE.height,
			canvasMaxWidth: EDITOR_CANVAS_MAX_SIZE.width,
			currentImageNaturalSize: {height: 0, width: 0},
			labelPopup: false,
      mousePressed: false,
      canvasCtx: null,
			lastMouseX: 0,
			lastMouseY: 0,
			clientX: 0,
			clientY: 0,
			mouseX: 0,
			mouseY: 0,
			canvasX: 0,
			canvasY: 0,
		}
	},
  methods: {
   getOffset(el) {
   const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
   };
  },
	drawImage(img) {
    let canvasWidth = this.canvasMaxWidth; 
		let canvasHeight = this.canvasMaxHeight; 
		if (img.width < this.canvasMaxWidth || img.height < this.canvasHeight) {
			this.setCanvasSize(img.width, img.height)
			this.canvasCtx.drawImage(img, 0,0, img.width, img.height, 0,0,img.width, img.height); // draw the image after every render
		} else {
			var hRatio = canvasWidth / img.width;
			var vRatio = canvasHeight / img.height;
			var ratio  = Math.min ( hRatio, vRatio );
			this.canvasCtx.drawImage(img, 0,0, img.width, img.height, 0,0,img.width*ratio, img.height*ratio); // draw the image after every render
		}
	},
  updateCoordinates(e) {
    this.mouseX = parseInt(e.clientX - this.canvasX);
    this.mouseY = parseInt(e.clientY - this.canvasY);
		this.clientX = e.clientX
		this.clientY = e.clientY
  if (this.mousePressed) {
        let canvas = this.$refs['editor-canvas'];
        this.canvasCtx.clearRect(0,0, canvas.width,canvas.height)

        let img = new Image();
        img.src = this.selectedFileUrl

        this.drawImage(img)
				this.redrawLabels()
				let width = this.mouseX - this.lastMouseX;
        let height = this.mouseY - this.lastMouseY;
				this.canvasCtx.beginPath()
        this.canvasCtx.rect(this.lastMouseX,this.lastMouseY,width,height);
        this.canvasCtx.strokeStyle = 'green';
        this.canvasCtx.lineWidth = 1;
        this.canvasCtx.stroke();
		}
  },
	resetCurrentLabel() {
		// removes drawn label box	
		let canvas = this.$refs['editor-canvas'];
		this.canvasCtx.clearRect(0,0, canvas.width,canvas.height)
		let img = new Image();
		img.src = this.selectedFileUrl
		this.drawImage(img)
		this.redrawLabels()
		this.lastMouseX = 0
		this.lastMouseY = 0
		this.canvasCtx.beginPath()
		this.canvasCtx.stroke();
	},
	openLabelSelect() {
		this.labelPopup = true
	},
	selectLabel(e) {
		this.createLabelBox({
			id: uuidv4(), 
			file: this.selectedFile,
			label: e.target.value,
			x: this.selectedLabel.x,
			y: this.selectedLabel.y,
			width: this.selectedLabel.width,
			height: this.selectedLabel.height,
			canvasHeight: this.$refs['editor-canvas'].height,
			canvasWidth: this.$refs['editor-canvas'].width,
			naturalImageHeight: this.currentImageNaturalSize.height,
			naturalImageWidth: this.currentImageNaturalSize.width
			});

		this.labelPopup = false
	},
	mouseUp(e) {
		let width = this.mouseX - this.lastMouseX;
    let height = this.mouseY - this.lastMouseY;
		this.selectedLabel.height = height
		this.selectedLabel.width = width
		this.selectedLabel.x = this.lastMouseX
		this.selectedLabel.y = this.lastMouseY
    this.mousePressed = false
		// saves labels
		this.openLabelSelect(e)
		},
   mouseDown(e) {
      this.mousePressed = true;
      this.lastMouseX = parseInt(e.clientX - this.canvasX);
      this.lastMouseY = parseInt(e.clientY - this.canvasY); 
    },
		onResize() {
     this.canvasX = this.getOffset(this.$refs['editor-canvas']).left
     this.canvasY = this.getOffset(this.$refs['editor-canvas']).top
		},
		redrawLabels() {
			this.labelBoxes.forEach((label) => {
				if (label.file.name === this.selectedFile.name) {
					this.canvasCtx.beginPath()
					this.canvasCtx.rect(label.x,label.y,label.width,label.height);
					this.canvasCtx.strokeStyle = 'green';
					this.canvasCtx.lineWidth = 1;
					this.canvasCtx.stroke();		
				}
				
				});
		},
		handleKeyUp(e) {
			if(e.key == "Escape") {
				this.labelPopup = false
				this.resetCurrentLabel()
			}
		},
		setCanvasSize(height, width) {
			this.$refs['editor-canvas'].width = width 
			this.$refs['editor-canvas'].height = height
		},
		setCurrentImageSize(height, width) {
			this.currentImageNaturalSize.height = height
			this.currentImageNaturalSize.width = width
		},
		...mapActions(['createLabelBox'])
	}, 
  computed: {
    ...mapState(['selectedFileUrl', 'selectedFile', 'files', 'labelBoxes', 'labels'])
	},
  watch: {
   selectedFileUrl: function(val) {
    let img = new Image();
    img.src = val
		
		let imgRef = document.getElementById(this.selectedFile.name)
		this.setCanvasSize(this.canvasMaxHeight, this.canvasMaxWidth)
		this.setCurrentImageSize(imgRef.naturalHeight, imgRef.naturalWidth)
		this.drawImage(img)
		this.redrawLabels()
		this.canvasX = this.getOffset(this.$refs['editor-canvas']).left
		this.canvasY = this.getOffset(this.$refs['editor-canvas']).top
   }
	},
	mounted() {
    let ctx = this.$refs['editor-canvas'].getContext('2d')
    this.canvasCtx = ctx;
		this.$refs['editor-canvas'].width = this.canvasMaxWidth 
		this.$refs['editor-canvas'].height = this.canvasMaxHeight //TODO how can we set this dynamically to match canvas hight exactly
		window.addEventListener('resize', this.onResize)
		window.addEventListener('keyup', this.handleKeyUp)
},
 
}
</script>

<style scoped>
	#editor {
		background-color: #000;
	}
	.label-popup {
		position: absolute;
		background: #333;
	}
	.label-popup select {
		width: 300px;;
	}
	.hidden {
		display: none;
	}
</style>
