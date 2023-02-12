<template>
	<v-layer>
		<component
			v-for="(el, index) in elements"
			:key="'el' + index"
			:is="el.component"
			:config="el.config"
			ref="el"
			@dragstart="abortDrag"
			@dragend="updateByIndex({el: $event.target, index})"
			@mouseenter="mouseenter($event, index)"
			@mouseleave="mouseleave(index)"
			@click="click($event, index)"
		/>
	</v-layer>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {grey01, grey02, blue02, white01} from '@/style/export.module.sass'

export default {
	name: 'ElementsHistory',
	props: {
		addCount: Number,
	},

	data: () => ({
		def: {
			component: 'v-rect',
			config: {
				stroke: grey02,
				fill: white01,
				strokeWidth: 1,
				draggable: true,
				width: 250,
				height: 250,
				y: (window.innerHeight / 2) - 125,
			},
			selected: null,
		},
	}),
	computed: {
		...mapGetters('history', ['elements', 'isHistory', 'mode']),
	},

	mounted() {
		if (!this.isHistory) this.addDefs()
	},
	watch: {
		addCount() {
			this.addDef()
		},
	},

	methods: {
		...mapActions('history', ['add', 'addMany', 'updateByIndex', 'newConnectMode', 'connectModeReject', 'connectModeSuccess']),
		mouseenter(e, index) {
			if (e.target.getClassName() === 'Rect') {
				this.$emit('cursor', 'pointer')
				if (this.selected && this.selected + 1 !== index) {
					this.elements[index].config.stroke = blue02
				}
			}
		},
		mouseleave(index) {
			this.$emit('cursor', 'default')
			if (index !== this.selected + 1) {
				this.elements[index].config.stroke = grey02
			}
		},
		addDef() {
			const el = JSON.parse(JSON.stringify(this.def))
			el.config.x = (+window.innerWidth / 2) - 125
			this.add({el});
		},
		addDefs() {
			const el1 = JSON.parse(JSON.stringify(this.def))
			el1.config.x = (+window.innerWidth / 2) - 280
			const el2 = JSON.parse(JSON.stringify(this.def))
			el2.config.x = (+window.innerWidth / 2) + 30
			this.addMany({els: [el1, el2]});
		},
		click(e, index) {
			if (e.target.getClassName() !== 'Rect') return
			if (this.mode !== 'connect') {
				this.startSelect(e.target, index)
			} else {
				if (this.selected) {
					if (index === this.selected + 1) {
						this.abortSelect()
					} else {
						if (e.target.getClassName() === 'Rect') this.endSelect(e.target, index)
					}
				}
			}
		},
		abortDrag(e) {
			if (this.mode === 'connect') e.target.stopDrag()
		},
		startSelect(target, index) {
			const x = target.x() + (target.width() / 2)
			const y = target.y() + (target.height() / 2)
			const stage = this.$parent.$parent?.$parent.$refs?.stage.getStage()
			const pointer = stage?.getPointerPosition()
			this.selected = index
			const selected = this.elements[index]
			selected.config.stroke = blue02
			selected.config.dash = [20, 7]
			this.newConnectMode({
				component: 'v-line',
				config: {
					points: [x, y, pointer.x, pointer.y],
					stroke: blue02,
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round',
					dash: [20, 7],
				},
			})
		},
		abortSelect() {
			this.resetSelected()
			this.$nextTick(() => this.connectModeReject())
		},
		endSelect(target, index) {
			this.resetSelected()
			const points = this.elements[0].config.points
			const config = this.elements[index].config
			config.stroke = grey02
			const half = config.width / 2
			this.$nextTick(() => this.connectModeSuccess({
				component: 'v-line',
				config: {
					points: [points[0], points[1], config.x + half, config.y + half],
					stroke: grey01,
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round',
				},
			}))
		},
		async resetSelected() {
			const selected = this.elements[this.selected + 1]
			selected.config.stroke = grey02
			delete selected.config.dash
			this.selected = null
			await this.$nextTick()
		},
	},
}
</script>

<style scoped>

</style>
