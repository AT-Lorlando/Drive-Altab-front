<template>
  <div >
    <canvas
          id="threecanvas"
          class="absolute w-screen h-screen inset-0 z-0"
        >
    </canvas>
    <HomeHeader />
    <slot />
  </div>  
</template>