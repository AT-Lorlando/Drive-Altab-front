<template>
    <div class="z-20 flex flex-col mt-10 overflow-y-auto text-xl text-white bg-primary-dark xl:mt-20 xl:pb-10">
        <div class="flex flex-col items-center self-center w-4/5 pl-8 space-y-10 text-center xl:w-2/5 xl:pl-0">
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