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
				width: 200,
				height: 200,
			},
			configCircle: {
				x: 100,
				y: 100,
				radius: 70,
				fill: 'red',
				stroke: 'black',
				strokeWidth: 4,
			},

			scaleBy: 1.04,
		}
	},
	methods: {
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
