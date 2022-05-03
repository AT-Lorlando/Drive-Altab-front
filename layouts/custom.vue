<template>
  <div>
    <canvas
          id="threecanvas"
          class="fixed w-full h-full inset-0 z-0"
        >
    </canvas>
    <div class="flex flex-col">
      <HomeHeader v-if="isTallEnough"/>
      <HomeSlider v-else/>
      <slot />
    </div>
  </div>  
</template>

<script setup>
const isTallEnough = ref(true)

onMounted(() => {
    isTallEnough.value = window.innerWidth > 1280
})
</script>