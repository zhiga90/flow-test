export default {
	namespaced: true,
	state: {
		elements: [
			{
				component: 'v-rect',
				config: {
					x: 500,
					y: 400,
					width: 70,
					height: 70,
					stroke: 'var(--grey01)',
					strokeWidth: 1,
					draggable: true,
				},
			},
		],
	},
	getters: {
		elements: (state) => state.elements,
	},
	mutations: {},
	actions: {},
	modules: {},
}
