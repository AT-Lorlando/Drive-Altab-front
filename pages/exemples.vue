<template>
    <div class="w-full h-screen xl:h-full bg-primary-dark flex flex-col text-white text-xl z-20">
        <div class="w-4/5 xl:w-2/5 self-center pl-8 xl:pl-0 mt-10 xl:mt-20 items-center flex flex-col text-center space-y-10">
            <h2>
            Exemple de retouche
            </h2>
            <SubBiphoto
                img1="/IMG1.png"
                img2="/IMG1bis.png"
                />
            <SubBiphoto
                img1="/IMG2.png"
                img2="/IMG2bis.png"
            />
            <SubBiphoto
                img1="/IMG3.png"
                img2="/IMG3bis.png"
            />
        </div>
    </div>
</template>
<script setup>
</script>

<style scoped>
h2 {
    @apply text-3xl mt-4 mb-2
}
</style>