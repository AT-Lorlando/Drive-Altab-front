<template>
    <div class="fixed top-0 flex flex-row p-4 justify-between items-center w-screen h-20 z-40 bg-primary-dark">
        <div class="flex flex-row space-x-2 xl:space-x-10 pl-4">
            <IconsMenu @click="goHome" class="icons" />
            <MolleculesInputCommand class="pl-4"/>
            <AltabButton class="w-48" Type="link" Route="/about" Title="A propos" Color="white" Size="medium"/>
            <AltabButton class="w-48" Type="link" Route="/contact-me" Title="Contact" Color="white" Size="medium"/>
            <AltabButton class="w-48" Type="link" Route="/exemples" Title="Retouches" Color="white" Size="medium"/>
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