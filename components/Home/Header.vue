<template>
    <div class="flex flex-row p-4 justify-between items-center w-full z-50">
        <IconsMenu class="icons"/>
        <MolleculesInputCommand class="pl-4"/>
        <IconsBell class="icons"/>
        <IconsAdd class="icons"/>
        <IconsView class="icons"/>
        <IconsRefresh class="icons"/>
        <IconsAlarm class="icons"/>
        <IconsUser class="icons"/>
        <IconsGear class="icons"/>
        <IconsExit class="icons"/>
    </div>
</template>

<style scoped>
.icons {
    @apply w-12 h-12 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out
}
</style>