<template>
	<v-layer>
		<component
			v-for="(el, index) in elements"
			:key="'el' + index"
			:is="el.component"
			:config="el.config"
			@dragend="updateByIndex({el: $event.target, index})"
		/>
	</v-layer>
</template>

<script>
import {mapGetters, mapActions} from 'vuex'
import {grey02, white01} from '@/style/export.module.sass'

export default {
	name: 'ElementsHistory',

	computed: {
		...mapGetters('history', ['elements', 'isHistory']),
	},

	mounted() {
		if (!this.isHistory) this.addDefs()
	},

	methods: {
		...mapActions('history', ['add', 'addMany', 'updateByIndex']),
		addDefs() {
			const el = {
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
			}
			const el1 = JSON.parse(JSON.stringify(el))
			el1.config.x = (+window.innerWidth / 2) - 280
			const el2 = JSON.parse(JSON.stringify(el))
			el2.config.x = (+window.innerWidth / 2) + 30
			this.addMany([el1, el2]);
		},
	},
}
</script>

<style scoped>

</style>
