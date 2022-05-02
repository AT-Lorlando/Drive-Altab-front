<template>
    <div class="absolute mt-56 z-20 w-80 h-80 bg-white flex flex-col rounded-xl border-2 border-white py-2 bg-opacity-75 justify-between">
        <div class="flex flex-row justify-between items-center border-b-2 border-primary-dark px-4 pb-1">
            <h2 class="text-2xl text-center uppercase">{{title}}</h2>
            <div class="flex flex-row items-center">
                <IconsExit class="w-10 h-10 hover:cursor-pointer" @click="close"/>
            </div>
        </div>
        <div class="px-2">
            <h2 class="text-black text-xl text-center pb-1">This folder is locked</h2>
            <div class="flex flex-row justify-center items-center">
                <input type="password" v-model="password" class="w-full h-12 p-2 border-2 rounded-xl border-primary-dark text-black text-center" placeholder="Password"/>
            </div>
            <a class="pl-2 underline text-blue-600 hover:cursor-pointer hover:text-blue-800">How can i get the password</a>
        </div>
        <div class="w-full">
            <div class="flex flex-row w-full justify-between px-2">                    
                <AltabButton @click="close" Title="Cancel" Color="black"/>
                <AltabButton @click="confirm" Title="Confirm" Color="transparent"/>
            </div>
        </div>
    </div>
</template>

<script>
export default {
     props: {
        title: {
            type: String,
            default: 'File'
        },
        close: {
            type: Function,
            default: () => {}
        },
        confirm : {
            type: Function,
            default: () => {}
        }
    },
}
</script>