<template>
	<v-layer>
		<component
			v-for="(connection, index) in connections"
			:key="'connection' + index"
			:is="connection.component"
			:config="connection.config"
		/>
		<component
			v-for="(block, index) in blocks"
			:key="'block' + index"
			:is="block.component"
			:config="block.config"
			@dragstart="blockDragStart($event, index)"
			@dragmove="blockDragMove($event, index)"
			@dragend="blockDragEnd($event, index)"
			@mouseenter="blocksMouseEnter"
			@mouseleave="blocksMouseLeave"
			@click="blockClick($event, index)"
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
		defBlock: {
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
		},
		selected: null,
		selectedId: '',
	}),
	computed: {
		...mapGetters('history', ['blocks', 'connections', 'isHistory', 'mode']),
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
		getId() {
			return (new Date()).getTime()
		},
		blocksMouseEnter(e) {
			this.$emit('cursor', 'pointer')
			if (this.selected && this.selected._id !== e.target._id) e.target.stroke(blue02)
		},
		blocksMouseLeave(e) {
			this.$emit('cursor', 'default')
			if (this.selected && this.selected._id !== e.target._id) e.target.stroke(grey02)
		},
		blockDragStart(e, index) {
			if (this.mode === 'connect') {
				e.target.stopDrag()
			} else {
				const id = this.blocks[index].id
				const left = this.connections.filter(item => item.leftId === id)
				const right = this.connections.filter(item => item.rightId === id)
				this.selectedId = id
				this.selected = {left, right}
			}
		},
		blockDragMove(e) {
			const half = e.target.width() / 2
			for (const {config} of this.selected.left || []) {
				config.points = [e.target.x() + half, e.target.y() + half, config.points[2], config.points[3]]
			}
			for (const {config} of this.selected.right || []) {
				config.points = [config.points[0], config.points[1], e.target.x() + half, e.target.y() + half]
			}
		},
		blockDragEnd(e, index) {
			const el = JSON.parse(JSON.stringify(this.blocks[index]))
			el.config = e.target.attrs
			this.updateByIndex({el, index, wrap: 'blocks'})
		},
		addDef() {
			const el = JSON.parse(JSON.stringify(this.defBlock))
			el.id = this.getId()
			el.config.x = (window.innerWidth / 2) - 125
			this.add({el, wrap: 'blocks'})
		},
		addDefs() {
			const el1 = JSON.parse(JSON.stringify(this.defBlock))
			const id = this.getId()
			el1.id = id
			el1.config.x = (window.innerWidth / 2) - 280
			const el2 = JSON.parse(JSON.stringify(this.defBlock))
			el2.id = id + 1
			el2.config.x = (window.innerWidth / 2) + 30
			this.addMany({els: [el1, el2], wrap: 'blocks'});
		},
		blockClick(e, index) {
			if (this.mode !== 'connect') {
				this.selectedId = this.blocks[index].id
				this.startSelect(e.target)
			} else {
				if (this.selected) {
					this.selected._id === e.target._id
						? this.abortSelect()
						: this.endSelect(e.target, index)
				}
			}
		},
		startSelect(target) {
			const x = target.x() + (target.width() / 2)
			const y = target.y() + (target.height() / 2)
			const stage = this.$parent.$parent?.$parent.$refs?.stage.getStage()
			const pointer = stage?.getPointerPosition()
			this.selected = target
			target.stroke(blue02)
			target.dash([20, 7])
			this.newConnectMode({
				component: 'v-line',
				config: {
					points: [x, y, pointer.x, pointer.y],
					stroke: blue02,
					strokeWidth: 2,
					dash: [20, 7],
				},
			})
		},
		abortSelect() {
			this.resetSelected()
			this.connectModeReject()
		},
		endSelect(target, index) {
			this.resetSelected()
			const points = this.connections[0].config.points
			target.stroke(grey02)
			const half = target.width() / 2
			const leftId = this.selectedId
			const rightId = this.blocks[index].id
			this.connectModeSuccess({
				component: 'v-line',
				id: this.getId(),
				leftId,
				rightId,
				config: {
					points: [points[0], points[1], target.x() + half, target.y() + half],
					stroke: grey01,
					strokeWidth: 2,
				},
			})
		},
		async resetSelected() {
			const selected = this.selected
			selected.stroke(grey02)
			selected.dash([])
			this.selected = null
		},
	},
}
</script>

<style scoped>

</style>
