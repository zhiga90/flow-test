<template>
	<v-layer>
		<component
			v-for="(el, index) in elements"
			:key="'el' + index"
			:is="el.component"
			:config="el.config"
			@dragend="updateByIndex({el: $event.target, index})"
			@mouseenter="$emit('cursor', 'pointer')"
			@mouseleave="$emit('cursor', 'default')"
		/>
	</v-layer>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {grey02, white01} from '@/style/export.module.sass'

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
		},
	}),
	computed: {
		...mapGetters('history', ['elements', 'isHistory']),
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
		...mapActions('history', ['add', 'addMany', 'updateByIndex']),
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
	},
}
</script>

<style scoped>

</style>
