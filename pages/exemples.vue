<template>
    <div class="w-full h-full bg-primary-dark flex flex-col text-white text-xl z-20">
        <div class="w-2/5 self-center mt-20 items-center flex flex-col text-center">
            <h2>
            Exemple de retouche
            </h2>
            <div class='container'>
                <div class='img background-img'></div>
                <div ref="toslide" class='img foreground-img'></div>
                <input ref="slider" type="range" min="1" max="1000" value="500" class="slider" name='slider' id="slider">
            </div>
        </div>
    </div>
</template>
<script setup>

const slider = ref(null)
const toslide = ref(null)

onMounted(()=> {
    slider.value?.addEventListener('input', () => {
        const width = slider.value.value;
        toslide.value.style.width = width/10 + '%';
    })


})

</script>
<style scoped>
h2 {
    @apply text-3xl mt-4 mb-2
}

.container {
  position: relative;
  width: 900px;
  height: 600px;
  border: 2px solid white;
}
.img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-size: 900px 100%;
}
.background-img {
    background-image: url('@/assets/imgs/IMG3.png');
}
.foreground-img {
    background-image: url('@/assets/imgs/IMG3bis.png');
    width: 50%;
}
.slider {
    background: none;
    -webkit-transition: .2s;
    transition: opacity .2s;
    -webkit-appearance: none;
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    outline: none;
    margin: 0;
    transition: all .2s;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0;
    border: none;
    background: none;
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
}

/* slider ball style */
.slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 5px;
    height: 600px;
    background: #fff;
    cursor: pointer;
    border: 2px solid #fff;
}


</style>