<template>
    <v-stage :config="configKonva" class="stage">
        <v-layer>
        </v-layer>
    </v-stage>
</template>

<script>

export default {
  data() {
    return {
      configKonva: {
        width: 200,
        height: 200
      },
    };
  }
};
</script>

<style lang="sass">
@import "normalize.css"
</style>
