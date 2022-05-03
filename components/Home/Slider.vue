<template>
    <div class="fixed left-0 flex flex-col py-4 justify-arround items-center w-16 h-screen z-40">
        <div class="flex flex-col space-y-10">
            <IconsMenu @click="goHome" class="icons" />
            <!-- <MolleculesInputCommand/> -->
            <NuxtLink to="/about" class="text-white">
                <IconsUser class="icons"/>
            </NuxtLink>
            <NuxtLink to="/contact-me" class="text-white">
                <IconsUser class="icons"/>
            </NuxtLink>
            <NuxtLink to="/exemples" class="text-white">
                <IconsUser class="icons"/>
            </NuxtLink>
        </div>


        <div v-if="!isLogged" class="flex flex-col space-y-10 items-center mt-10">
            <NuxtLink to="/login" class=" text-white">
                <IconsUser class="icons"/>
            </NuxtLink>
            <NuxtLink to="/register" class=" text-white">
                <IconsExit class="icons"/>
            </NuxtLink>
        </div>
        <div v-else class="flex flex-col space-y-10 items-center">
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