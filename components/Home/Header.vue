<template>
    <div class="flex flex-row p-4 justify-between items-center w-full z-20">
        <div class="flex flex-row space-x-10 pl-4">
            <IconsMenu @click="goHome" class="icons" />
            <MolleculesInputCommand class="pl-4"/>
            <AltabButton Type="link" Route="/login" Title="A propos" Color="white" Size="medium"/>
            <AltabButton Type="link" Route="/login" Title="Contact" Color="white" Size="medium"/>
        </div>
        <!-- <IconsBell class="icons"/>
        <IconsAdd class="icons"/>
        <IconsView class="icons"/>
        <IconsRefresh class="icons"/>
        <IconsAlarm class="icons"/> -->
        <div class="flex flex-row space-x-4 items-center pr-4">
        </div>

        <div v-if="!isLogged" class="flex flex-row space-x-4 items-center pr-4">
            <AltabButton Type="link" Route="/login" Title="Se connecter" Color="black" Size="medium"/>
            <AltabButton Type="link" Route="/register" Title="S'inscrire" Color="white" Size="medium"/>
        </div>
        <div v-else class="flex flex-row space-x-10 items-center pr-4">
        <NuxtLink to="/user" class="flex flex-row justify-center items-center text-white space-x-4">
            <p>
                {{user}}
            </p>
            <IconsUser class="icons"/>
        </NuxtLink>
            <!-- <IconsGear class="icons"/> -->
            <IconsExit class="icons" @click="logout"/>
        </div>
    </div>
</template>

<script setup>
import axios from "axios";
let APIurl = "http://127.0.0.1:3333/api";
const isLogged = ref(false)
const user = ref({})
const router = useRouter()


function logout() {
    axios.get(APIurl+'/logout',{ withCredentials: true })
    .then(response => {
        console.log(response)
        isLogged.value = false
        console.log(isLogged)
    }).catch(error => {
        console.log(error)
    })
    // document.dispatchEvent(new Event('session-change'))
    // localStorage.setItem('isLogged', false)
}

function goHome() {
    // Document emit event
    router.push('/')
    document.dispatchEvent(new Event('go-home'))
}

onMounted(() => {
    document.addEventListener("session-change", () => {
        console.log("session-change")
        isLogged.value = localStorage.getItem("isLogged")
        user.value = localStorage.getItem("user.name")
        console.log('User')
        console.log(user.value)
        console.log(isLogged.value)
    })
    
})
</script>

<style scoped>
.icons {
    @apply w-12 h-12 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center
}
</style>