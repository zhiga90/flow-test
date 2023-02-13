let elements = {blocks: [], connections: []}
let history = JSON.parse(localStorage.getItem('history'))
let step = JSON.parse(localStorage.getItem('step'))
if (!Number.isInteger(step)) step = 0
if (Array.isArray(history) && history.length && step > 0) {
	Object.assign(elements, JSON.parse(history[step - 1]))
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
		blocks: (state) => state.elements.blocks,
		connections: (state) => state.elements.connections,
		history: (state) => state.history,
		isHistory: (state) => !!state.history.length,
		isUndo: (state) => state.step > 1 && state.mode !== 'connect',
		isRedo: (state) => state.step < state.history.length && state.mode !== 'connect',
		isClear: (state) => state.elements.blocks?.length && state.elements.connections?.length && state.mode !== 'connect',
		isAdd: (state) => state.mode !== 'connect',
		mode: (state) => state.mode,
	},
	mutations: {
		setActive(state, el) {
			state.elements.connections.unshift(el)
		},
		removeActive(state) {
			state.elements.connections.shift()
		},
		setMode(state, mode) {
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
		add({state, dispatch}, {el, isToTop, wrap}) {
			const elements = state.elements
			isToTop ? elements[wrap].unshift(el) : elements[wrap].push(el)
			dispatch('toHistory', elements)
		},
		addMany({state, dispatch}, {els, wrap}) {
			const elements = state.elements
			elements[wrap] = [...state.elements[wrap], ...els]
			dispatch('toHistory', elements)
		},
		updateByIndex({state, dispatch}, {el, index, wrap}) {
			state.elements[wrap][index] = el
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
			dispatch('add', {el, wrap: 'connections'})
		},
		connectModeReject({commit}) {
			commit('removeActive')
			commit('setMode', null)
		},
	},
	modules: {},
}
