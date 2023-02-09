<template>
	<v-stage
		ref="stage"
		:config="configKonva"
		class="stage"
		@wheel="wheel"
	>
		<v-layer>
			<v-circle :config="configCircle" />
		</v-layer>
	</v-stage>
</template>

<script>

export default {
	data() {
		return {
			configKonva: {
				width: 1000,
				height: 1000,
			},
			configCircle: {
				x: 100,
				y: 100,
				radius: 70,
				fill: 'red',
				stroke: 'black',
				strokeWidth: 4,
			},

			scaleBy: 1.1,
		}
	},
	mounted() {
		this.setSize()
		window.addEventListener('resize', this.setSize)
	},
	destroyed() {
		window.removeEventListener('resize', this.setSize)
	},
	methods: {
		setSize() {
			const width = Math.floor(document.documentElement.clientWidth)
			const scale = width / this.configKonva.width
			const stage = this.$refs.stage.getStage()

			stage.width(this.configKonva.width * scale);
			stage.height(this.configKonva.height * scale);
			stage.scale({ x: scale, y: scale });
		},
		wheel(e) {
			e.evt.preventDefault()

			const stage = this.$refs.stage.getStage()
			const oldScale = stage.scaleX()
			const pointer = stage.getPointerPosition()

			const mousePointTo = {
				x: (pointer.x - stage.x()) / oldScale,
				y: (pointer.y - stage.y()) / oldScale,
			};

			// how to scale? Zoom in? Or zoom out?
			let direction = e.evt.deltaY > 0 ? 1 : -1

			// when we zoom on trackpad, e.evt.ctrlKey is true
			// in that case lets revert direction
			if (e.evt.ctrlKey) {
				direction = -direction;
			}

			const newScale = direction > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy

			stage.scale({x: newScale, y: newScale})

			const newPos = {
				x: pointer.x - mousePointTo.x * newScale,
				y: pointer.y - mousePointTo.y * newScale,
			};
			stage.position(newPos)
		},
	},
}
</script>

<style lang="sass">
@import "normalize.css"
</style>
