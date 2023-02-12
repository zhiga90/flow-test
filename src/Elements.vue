<template>
	<v-layer @click="click">
		<component
			v-for="(el, index) in elements"
			:key="'el' + index"
			:is="el.component"
			:config="el.config"
			ref="el"
			@dragstart="abortDrag"
			@dragend="updateByIndex({el: $event.target, index})"
			@mouseenter="mouseenter"
			@mouseleave="$emit('cursor', 'default')"
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
		mouseenter(e) {
			if (e.target.getClassName() === 'Rect') {
				this.$emit('cursor', 'pointer')
			}
		},
		addDef() {
			const el = JSON.parse(JSON.stringify(this.def))
			el.config.x = (+window.innerWidth / 2) - 125
			this.add(el);
		},
		addDefs() {
			const el1 = JSON.parse(JSON.stringify(this.def))
			el1.config.x = (+window.innerWidth / 2) - 280
			const el2 = JSON.parse(JSON.stringify(this.def))
			el2.config.x = (+window.innerWidth / 2) + 30
			this.addMany([el1, el2]);
		},
		click(e) {
			e.cancelBubble = false
			console.log(e.target.getClassName())
			if (e.target.getClassName() !== 'Rect') return
			console.log(e.target.getClassName())
			console.log(e.target._id)
			console.log(this.selected?._id)
			if (this.mode !== 'connect') {
				if (this.selected && this.selected._id) {
					if (e.target._id === this.selected._id) {
						this.abortSelect(e.target)
					} else {
						if (e.target.getClassName() === 'Rect') this.endSelect(e.target)
					}
				} else {
					this.startSelect(e.target)
				}
			}
		},
		abortDrag(e) {
			if (this.mode === 'connect') e.target.stopDrag()
		},
		startSelect(target) {
			const x = target.x() + (target.width() / 2)
			const y = target.y() + (target.height() / 2)
			const stage = this.$parent.$parent?.$parent.$refs?.stage.getStage()
			const pointer = stage?.getPointerPosition()
			this.selected = target
			this.newConnectMode({
				component: 'v-line',
				config: {
					points: [x, y, pointer.x, pointer.y],
					stroke: blue02,
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round',
					dash: [33, 10],
				},
			})
		},
		abortSelect() {
			this.connectModeReject()
			this.selected = null
		},
		endSelect(target) {
			const points = this.elements[this.elements.length - 1].config.points
			const half = target.width() / 2
			this.connectModeSuccess({
				component: 'v-line',
				config: {
					points: [points[0], points[1], target.x() + half, target.y() + half],
					stroke: grey01,
					strokeWidth: 2,
					lineCap: 'round',
					lineJoin: 'round',
				},
			})
		},
	},
}
</script>

<style scoped>

</style>
