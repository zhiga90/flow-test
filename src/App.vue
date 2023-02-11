<template>
	<LayoutDefault @add="add++" @zoom="zoom">
		<v-stage
			ref="stage"
			:config="configKonva"
			class="stage"
			@wheel="wheel"
		>
			<Elements
				:add-count="add"
				@cursor="$refs.stage.getStage().container().style.cursor = $event"
			/>
		</v-stage>
	</LayoutDefault>
</template>

<script>
import LayoutDefault from './Layout.vue'
import Elements from './Elements.vue'

export default {
	components: {
		LayoutDefault,
		Elements,
	},

	data() {
		return {
			configKonva: {
				width: 1000,
				height: 1000,
				draggable: true,
			},
			scaleBy: 1.1,
			add: 0,
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

			stage.width(this.configKonva.width * scale)
			stage.height(this.configKonva.height * scale)
			stage.scale({x: scale, y: scale})
		},
		wheel(e) {
			e.evt.preventDefault()
			let direction = e.evt.deltaY > 0 ? -1 : 1
			if (e.evt.ctrlKey) {
				direction = -direction
			}
			this.zoom(direction)
		},
		zoom(direction, fromCenter) {
			const stage = this.$refs.stage.getStage()
			const oldScale = stage.scaleX()
			const pointer = fromCenter
				? {x: this.configKonva.width / 2, y: this.configKonva.height / 2}
				: stage.getPointerPosition()

			const mousePointTo = {
				x: (pointer.x - stage.x()) / oldScale,
				y: (pointer.y - stage.y()) / oldScale,
			};

			let newScale = 1
			if (direction !== 0) newScale = direction > 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy

			stage.scale({x: newScale, y: newScale})

			let newPos = {x: 0, y: 0}
			if (direction !== 0)
				newPos = {
					x: pointer.x - mousePointTo.x * newScale,
					y: pointer.y - mousePointTo.y * newScale,
				}

			stage.position(newPos)
		},
	},
}
</script>

<style lang="sass">
@import "style/main"
</style>
