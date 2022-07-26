<template>
    <div class='container'>
        <div ref="img1" class='img background-img'></div>
        <div ref="img2" class='img foreground-img'></div>
        <input ref="slider" type="range" min="1" max="1000" value="500" class="slider" name='slider' id="slider">
    </div>
</template>
<script setup>
const slider = ref(null)
const img1 = ref(null)
const img2 = ref(null)

const props = defineProps({
  img1: {
    type: String,
    default: '',
  },
  img2: {
    type: String,
    default: '',
  },
});

function slide_exemple(t, tmax) {    
    if(t < tmax) {
        if ( t > tmax / 2 ) {
            slider.value.value = 500 - (t - tmax) 
        } else {
            slider.value.value = 500 + t
        }
        const width = slider.value.value;
        img2.value.style.width = width/10 + '%';
        setTimeout(() => {
            slide_exemple(t+10, tmax)
        }, 10)
    }
}

onMounted(()=> {
    img1.value.style.backgroundImage = `url('${props.img1}')`
    img2.value.style.backgroundImage = `url('${props.img2}')`
    slider.value?.addEventListener('input', () => {
        const width = slider.value.value;
        img2.value.style.width = width/10 + '%';
    })

    slide_exemple(0,1000)
})
</script>
<style scoped>
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
.foreground-img {
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

@media (max-width: 1280px) {
    .container {
        position: relative;
        width: 300px;
        height: 200px;
        border: 2px solid white;
    }
    .img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: 300px 100%;
    }
    .foreground-img {
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
        height: 200px;
        background: #fff;
        cursor: pointer;
        border: 2px solid #fff;
    }
}




</style>