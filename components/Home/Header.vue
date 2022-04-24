<template>
    <div class="flex flex-row p-4 justify-between items-center w-full z-50">
        <div class="flex flex-row space-x-10 pl-4">
            <MolleculesInputCommand class="pl-4"/>
        </div>
        <!-- <IconsBell class="icons"/>
        <IconsAdd class="icons"/>
        <IconsView class="icons"/>
        <IconsRefresh class="icons"/>
        <IconsAlarm class="icons"/> -->
        <div class="flex flex-row space-x-4 items-center">
            <AltabButton @click="this.$router.push('login')" class="w-40 self-center" Title="Se connecter" Color="black" Size="medium"/>
            <AltabButton @click="this.$router.push('register')" class="w-40 self-center" Title="S'inscrire" Color="white" Size="medium"/>
            <IconsUser class="icons"/>
            <!-- <IconsGear class="icons"/> -->
            <IconsExit class="icons"/>
        </div>
    </div>
</template>

<style scoped>
.icons {
    @apply w-12 h-12 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out
}
</style>