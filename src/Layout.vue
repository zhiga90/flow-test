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
				<span class="material-icons-round"> add </span>
			</button>
			<button
				class="button default zoom minus"
				@click="$emit('zoom', -1, true)"
			>
				<span class="material-icons-round"> remove </span>
			</button>
		</div>
		<div class="for-z-index horizontal">
			<button
				class="button default history undo"
				@click="$emit('history', -1)"
			>
				<span class="material-icons-round"> undo </span>
			</button>
			<button
				class="button default history redo"
				@click="$emit('history', 1)"
			>
				<span class="material-icons-round"> redo </span>
			</button>
		</div>
		<slot />
	</div>
</template>

<script>
export default {
	name: 'LayoutDefault',
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
		box-shadow: 0 0 0 $white
		transition: all .3s
		width: $button-size
		height: $button-size
		border-radius: $button-size
		border: solid 1px $grey-02
		color: $grey-01
		background: $white
		span
			font-size: $button-size / 1.5
		&:hover
			box-shadow: 0 0 $button-size / 4 $grey-02
			color: $primary-hover
			border-color: $primary

		&.big
			width: $button-size * 1.3
			height: $button-size * 1.3
			border-radius: $button-size * 1.3
			span
				font-size: $button-size

		&.primary
			border: $primary
			color: $white
			background: $primary
			&:hover
				background: $primary-hover
</style>
