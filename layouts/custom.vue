<template>
  <div class="h-screen w-full bg-primary-dark overflow-y-clip">
    <canvas
          id="threecanvas"
          class="absolute w-full h-full inset-0 z-0"
        >
    </canvas>
    <div class="h-full w-full flex flex-col">
      <HomeHeader v-if="isMobile"/>
      <HomeSlider v-else/>
      <slot />
    </div>
  </div>  
</template>

<script setup>
const isMobile = ref(true)
provide('isMobile', isMobile)

onMounted(() => {
      isMobile.value = window.innerWidth > 1280 && !((/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ||
      (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.platform))) ? true:false);;
})
</script>