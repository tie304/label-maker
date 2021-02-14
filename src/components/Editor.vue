<template>
  <div id="editor" v-bind:class="{imageselected: selectedFile}">
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
import { EDITOR_CANVAS_MAX_SIZE, EDITOR_ZOOM_INC } from '../main.js';

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
			scaledHeight: null,
			scaledWidth: null,
			zoom: 1,// zoom level of canvas. 1 == 100%
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
		let hRatio = canvasWidth / img.width;
		let vRatio = canvasHeight / img.height;
		let ratio  = Math.min ( hRatio, vRatio );
		this.setCanvasSize(img.height * ratio, img.width * ratio)

		let xClip = 0;
		let yClip = 0;
		let scaledHeight = (img.height * ratio) * this.zoom
		let scaledWidth = (img.width * ratio) * this.zoom
		this.scaledHeight = scaledHeight
		this.scaledWidth = scaledWidth
		if (this.zoom > 1) {
			//let xPercent = this.mouseX / this.canvasMaxWidth
			//let yPercent = this.mouseY / this.canvasMaxHeight
			// is middle of screen by default. It seems 1000 for each number is top left while 1 == bottom right. Could this be because the width is 1000?
			// these numbers get exponetally smaller bottom right and bigger top left. To position clip i'll need to find the right function to set these values
			// TODO need to dynamically change x y postion 	
			let xDir = 2
			let yDir = 2
			xClip = (img.width / xDir) - (img.width / xDir / this.zoom)
			yClip = (img.height / yDir) - (img.height / yDir / this.zoom)
		}
		
		this.canvasCtx.drawImage(img, xClip,yClip, img.width, img.height, 0,0,scaledWidth, scaledHeight); // draw the image after every render
		
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
	render() {
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
			zoom: this.zoom,
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
					if (label.id == this.highlightedLabel) {
						this.canvasCtx.lineWidth = "5"
					} else {
						this.canvasCtx.lineWidth = "1";
					}
					this.canvasCtx.strokeStyle = 'green';

					this.canvasCtx.rect(
						label.x,
						label.y,
						label.width * this.zoom,
						label.height * this.zoom
					);
					console.log(label.height, label.width, "height width")
					console.log(label.x / this.zoom, label.y / this.zoom, "label x label y")
					this.canvasCtx.stroke();
				}
				
				});
		},
		handleKeyUp(e) {
			if(e.key == "Escape") {
				this.labelPopup = false
				this.render()
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
		handleZoom(e) {
			e.preventDefault()
			if (e.deltaY < 0) {
				this.zoom += EDITOR_ZOOM_INC
			} else if(e.deltaY > 0 && this.zoom > 1) {
				this.zoom -= EDITOR_ZOOM_INC
			}
			this.zoom = parseFloat(this.zoom.toFixed(2)) // because of random number error error while ++ 
			this.render()
		},
		...mapActions(['createLabelBox'])
	}, 
  computed: {
    ...mapState(['selectedFileUrl', 'selectedFile', 'files', 'labelBoxes', 'labels', 'highlightedLabel'])
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
   },
		highlightedLabel: function() {
			this.render()
		},
		labelBoxes() {
			this.render()
		},
	},
	mounted() {
    let ctx = this.$refs['editor-canvas'].getContext('2d')
    this.canvasCtx = ctx;
		this.$refs['editor-canvas'].width = this.canvasMaxWidth 
		this.$refs['editor-canvas'].height = this.canvasMaxHeight //TODO how can we set this dynamically to match canvas hight exactly
		window.addEventListener('resize', this.onResize)
		window.addEventListener('keyup', this.handleKeyUp)
		this.$refs['editor-canvas'].addEventListener('wheel', this.handleZoom)
},
 
}
</script>

<style scoped>
	#editor {
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 1rem;
		width: 1000px;
		height: 600px;
		padding: 10rem;
	}
	.imageselected {
		background-color: var(--secondary--color);
	}
	.label-popup {
		position: absolute;
		background: var(--primary-color);
	}
	.label-popup select {
		width: 300px;
	}
	.hidden {
		display: none;
	}
</style>
