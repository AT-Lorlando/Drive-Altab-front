<template>
    <div class="w-auto text-white text-4xl z-10">
      <button v-for="f in path" class="pathButton" @click="$emit('pathClick', f)">
        {{ `/` + f?.name }}
      </button>
    </div>
</template>

<script setup>

const path = inject('path')
const emit = defineEmits(['pathClick'])

</script>

<style scoped>
.pathButton {
  @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform;
}
</style>