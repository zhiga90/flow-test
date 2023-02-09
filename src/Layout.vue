<template>
	<div
		class="layout"
		ref="layout"
	>
		<div class="for-z-index">
		<button class="button zoom plus" @click="$emit('zoom', 1, true)">
			<span class="material-icons-round"> add </span>
		</button>
		<button class="button zoom minus" @click="$emit('zoom', -1, true)">
			<span class="material-icons-round"> remove </span>
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
		z-index: 999999
		visibility: hidden

	.button
		position: absolute
		width: $button-size
		height: $button-size
		border-radius: $button-size
		left: $button-size / 2
		border: solid 1px $grey-02
		color: $grey-01
		background: $white
		visibility: visible
		cursor: pointer
		display: flex
		align-items: center
		justify-content: center
		&:hover
			box-shadow: 0 0 $button-size / 4 $grey-02
			color: $primary
		&.plus
			top: $button-size / 2
		&.minus
			top: $button-size * 2

</style>
