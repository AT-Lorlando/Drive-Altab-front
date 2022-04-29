<template>
    <div class="pl-12 w-full text-white text-4xl z-10">
      <button v-for="f in path" class="pathButton" @click="$emit('pathClick', f)">
        {{ `/` + f?.name }}
      </button>
    </div>
</template>

<script setup>

// const props = defineProps({
//   path: {
//     type: Array,
//     default: () => [{
//       name: 'Home',
//       type: 'Folder',
//       path: '/',
//       isLocked: false,
//       id: 1,
//     }],
//   }
// })
const path = inject('path')

const emit = defineEmits(['pathClick'])

onMounted(() => {
  console.log("Path mounted")
  console.log(path)
})

</script>

<style scoped>
.pathButton {
  @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform;
}
</style>