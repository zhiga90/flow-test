<template>
	<div
		class="layout"
		ref="layout"
	>
		<div class="for-z-index vertical">
			<button
				class="button primary big add plus"
				@click="$emit('add')"
			>
				<span class="material-icons-round"> add </span>
			</button>
			<button
				class="button default zoom plus"
				@click="$emit('zoom', 1, true)"
			>
				<span class="material-icons-round"> zoom_in </span>
			</button>
			<button
				class="button default zoom minus"
				@click="$emit('zoom', -1, true)"
			>
				<span class="material-icons-round"> zoom_out </span>
			</button>
			<button
				class="button default zoom reset"
				@click="$emit('zoom', 0)"
			>
				<span class="material-icons-round"> zoom_in_map </span>
			</button>
		</div>
		<div class="for-z-index horizontal">
			<button
				class="button default history undo"
				:disabled="!isUndo"
				@click="historyStep(-1)"
			>
				<span class="material-icons-round"> undo </span>
			</button>
			<button
				class="button default history redo"
				:disabled="!isRedo"
				@click="historyStep(1)"
			>
				<span class="material-icons-round"> redo </span>
			</button>
			<button
				class="button default history clear"
				:disabled="!isClear"
				@click="clear"
			>
				<span class="material-icons-round"> close </span>
			</button>
		</div>
		<slot />
	</div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'

export default {
	name: 'LayoutDefault',

	computed: {
		...mapGetters('history', ['isUndo', 'isRedo', 'isClear']),
	},

	methods: {
		...mapActions('history', ['historyStep', 'clearHistory', 'removeElements']),
		clear() {
			this.removeElements()
			this.$emit('zoom', 0)
		},
	},
}
</script>

<style
		scoped
		lang="sass"
>
.layout
	position: relative

	.for-z-index
		position: absolute
		z-index: 10
		visibility: hidden
		top: $button-size / 2
		left: $button-size / 2
		display: flex

		&.vertical
			flex-direction: column

			.button
				margin-top: $button-size / 2

				&:first-child
					margin-top: 0

		&.horizontal
			left: ($button-size) + ($button-size * 1.3)

			.button
				margin-left: $button-size / 2

				&:first-child
					margin-left: 0

	.button
		visibility: visible
		cursor: pointer
		display: flex
		align-items: center
		justify-content: center
		box-shadow: 0 0 0 var(--white01)
		transition: all .3s
		width: $button-size
		height: $button-size
		border-radius: $button-size
		border: solid 1px var(--grey02)
		color: var(--grey01)
		background: var(--white01)

		span
			font-size: $button-size / 1.5

		&:hover
			box-shadow: 0 0 $button-size / 4 var(--grey02)
			color: $primary-hover
			border-color: $primary

		&:disabled
			cursor: auto
			color: var(--grey02)
			border-color: var(--grey03)

			&:hover
				color: var(--grey02)
				box-shadow: 0 0 0 var(--white01)
				border-color: var(--grey03)


		&.big
			width: $button-size * 1.3
			height: $button-size * 1.3
			border-radius: $button-size * 1.3

			span
				font-size: $button-size

		&.primary
			border: $primary
			color: var(--white01)
			background: $primary

			&:hover
				background: $primary-hover
</style>
