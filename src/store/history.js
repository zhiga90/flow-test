let elements = []
let history = JSON.parse(localStorage.getItem('history'))
let step = JSON.parse(localStorage.getItem('step'))
if (!Number.isInteger(step)) step = 0
if (Array.isArray(history) && history.length && step > 0) {
	elements = JSON.parse(history[step - 1])
} else {
	history = []
}

export default {
	namespaced: true,
	state: {
		elements,
		history,
		step,
		mode: null,
	},
	getters: {
		elements: (state) => state.elements,
		history: (state) => state.history,
		isHistory: (state) => !!state.history.length,
		isUndo: (state) => state.step > 1 && state.mode !== 'connect',
		isRedo: (state) => state.step < state.history.length && state.mode !== 'connect',
		isClear: (state) => state.elements.length && state.mode !== 'connect',
		isAdd: (state) => state.mode !== 'connect',
		mode: (state) => state.mode,
	},
	mutations: {
		setActive(state, el) {
			state.elements.push(el)
		},
		removeActive(state) {
			state.elements.splice(state.elements.length - 1)
		},
		setMode (state, mode) {
			state.mode = mode
		},
		toHistory(state, elements) {
			if (state.history.length === 30) state.history.shift()
			state.history.push(JSON.stringify(elements))
			localStorage.setItem('history', JSON.stringify(state.history))
		},
		deleteHistoryFrom(state, {index, isBackup}) {
			state.history.splice(index)
			if (!isBackup) localStorage.setItem('history', JSON.stringify(state.history))
		},
		setStep(state, step) {
			state.step = step
			localStorage.setItem('step', JSON.stringify(step))
			state.elements = JSON.parse(state.history[step - 1]) || []
		},
	},
	actions: {
		add({state, dispatch}, el) {
			const elements = [...state.elements, ...[el]]
			dispatch('toHistory', elements)
		},
		addMany({state, dispatch}, els) {
			const elements = [...state.elements, ...els]
			dispatch('toHistory', elements)
		},
		updateByIndex({state, dispatch}, {el, index}) {
			const component = 'v-' + el.getClassName().toLowerCase()
			state.elements[index] = {component, config: el.attrs}
			dispatch('toHistory', state.elements)
		},
		toHistory({state, commit}, els) {
			const step = state.step < 30 ? state.step + 1 : state.step
			if (state.step !== state.history.length) {
				commit('deleteHistoryFrom', {index: state.step, isBackup: true})
			}
			commit('toHistory', els)
			commit('setStep', step)
		},
		clearHistory({commit}) {
			commit('deleteHistoryFrom', {index: 1, isBackup: false})
			commit('setStep', 1)
		},
		historyStep({state, commit}, step) {
			if (step < 0 && state.step > 1) commit('setStep', state.step - 1)
			if (step > 0 && state.step < state.history.length) commit('setStep', state.step + 1)
		},
		removeElements({dispatch}) {
			dispatch('toHistory', [])
		},
		newConnectMode({commit}, el) {
			commit('setActive', el)
			commit('setMode', 'connect')
		},
		connectModeSuccess({dispatch}, el) {
			dispatch('connectModeReject')
			console.log(el)
		},
		connectModeReject({commit}) {
			commit('removeActive')
			commit('setMode', 'null')
		},
	},
	modules: {},
}
