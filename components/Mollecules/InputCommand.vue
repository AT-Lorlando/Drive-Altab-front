
<script setup>
const $router = useRouter()
function search (e) {
    let search = e.target[0].value
    if(search.toLowerCase() != 'home') {
        $router.push(e.target[0].value)
    } else {
        $router.push('/')
    }
}

onMounted(() => {
    // Event listener on ctrl + k
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.keyCode == 75) {
            e.preventDefault()
            document.getElementById('input').focus()
        }
    })
})
</script>

<template>
    <div class="flex flex-row justify-center text-white items-center py-2 px-3 rounded-2xl border-2 border-white space-x-2">
        <IconsSearch class="w-8 h-8" />
        <form @submit.prevent="search">
            <input class="bg-transparent pl-2" type="text" placeholder="Chercher un dossier" id="input"/>
        </form>
        <p>(Ctrl+K)</p>
    </div>
</template>