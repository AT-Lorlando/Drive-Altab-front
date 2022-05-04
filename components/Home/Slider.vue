<template>
    <div class="fixed left-0 flex flex-col py-4 justify-arround items-center w-16 h-screen z-40">
        <div class="flex flex-col space-y-10">
            <IconsMenu @click="goHome" class="icons" />
            <!-- <MolleculesInputCommand/> -->
            <NuxtLink to="/about" class="text-white">
                <IconsAbout class="icons"/>
            </NuxtLink>
            <NuxtLink to="/contact-me" class="text-white">
                <IconsContact class="icons"/>
            </NuxtLink>
            <NuxtLink to="/exemples" class="text-white">
                <IconsImage class="icons"/>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
const router = useRouter()



function goHome() {
    // Document emit event
    router.push('/')
    document.dispatchEvent(new Event('go-home'))
}
</script>

<style scoped>
.icons {
    @apply w-12 h-12 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center
}
</style>