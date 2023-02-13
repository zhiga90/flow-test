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
			@dragstart="abortDrag"
			@dragend="blockDrag($event, index)"
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
		blockDrag(e, index) {
			const el = JSON.parse(JSON.stringify(this.blocks[index]))
			el.config = e.target.attrs
			this.updateByIndex({el, index, wrap: 'blocks'})
		},
		addDef() {
			const el = JSON.parse(JSON.stringify(this.defBlock))
			el.id = this.getId()
			console.log(el.id)
			el.config.x = (+window.innerWidth / 2) - 125
			this.add({el, wrap: 'blocks'})
		},
		addDefs() {
			const el1 = JSON.parse(JSON.stringify(this.defBlock))
			const id = this.getId()
			el1.id = id
			el1.config.x = (+window.innerWidth / 2) - 280
			const el2 = JSON.parse(JSON.stringify(this.defBlock))
			el2.id = id + 1
			el2.config.x = (+window.innerWidth / 2) + 30
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
		abortDrag(e) {
			if (this.mode === 'connect') e.target.stopDrag()
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
