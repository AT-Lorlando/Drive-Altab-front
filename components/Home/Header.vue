<template>
    <div class="flex flex-row p-4 justify-between items-center w-full z-20">
        <div class="flex flex-row space-x-10 pl-4">
            <IconsMenu @click="goHome" class="icons" />
            <MolleculesInputCommand class="pl-4"/>
            <AltabButton Type="link" Route="/about" Title="A propos" Color="white" Size="medium"/>
            <AltabButton Type="link" Route="/contact-me" Title="Contact" Color="white" Size="medium"/>
            <AltabButton Type="link" Route="/exemples" Title="Retouches" Color="white" Size="medium"/>
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
const baseURL = "https://api.drive.altab.tech/api";
const isLogged = ref(false)
const user = ref({})
const router = useRouter()

function logout() {
    axios.get(baseURL+'/logout',{ withCredentials: true })
    .then(response => {
        isLogged.value = false
    }).catch(error => {
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
        isLogged.value = localStorage.getItem("isLogged")
        user.value = localStorage.getItem("user.name")
    })
    axios.get(`${baseURL}/session`,{ withCredentials: true })
        .then(res => {
            if(res.status === 200) {
                isLogged.value = true
                user.value = res.data.user
                localStorage.setItem('isLogged', true)
                document.dispatchEvent(new Event('session-change'))
            }
        }).catch(err => {
        })    
})
</script>

<style scoped>
.icons {
    @apply w-12 h-12 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center
}
</style>