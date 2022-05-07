<template>
    <div class="bg-primary-dark flex flex-col text-white text-xl z-20 mt-10  xl:mt-20">
        <div class="w-4/5 xl:w-2/5 self-center pl-8 xl:pl-0 items-center flex flex-col text-center space-y-10 overscroll-y-auto">
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
    @apply text-xl xl:text-3xl mt-4 mb-2
}
</style>