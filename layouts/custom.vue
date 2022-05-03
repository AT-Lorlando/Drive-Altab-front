<template>
  <div class="w-full h-screen">
    <canvas
          id="threecanvas"
          class="absolute w-full h-full inset-0 z-0"
        >
    </canvas>
    <HomeHeader />
    <slot />
  </div>  
</template>