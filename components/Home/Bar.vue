<template>
    <div class="flex flex-col p-8 justify-between items-center h-full">
        <IconsMenu class="icons"/>
        <IconsBell class="icons"/>
        <IconsAdd class="icons"/>
        <IconsView class="icons"/>
        <IconsUser class="icons"/>
        <IconsRefresh class="icons"/>
        <IconsAlarm class="icons"/>
        <IconsGear class="icons"/>
        <IconsExit class="icons"/>
    </div>
</template>

<style scoped>
.icons {
    @apply w-16 h-16 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out
}
</style>