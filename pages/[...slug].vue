<template>
  <div class="h-full w-full">
  <div v-if="pending" class="text-white">
      Loading ...
    </div>
    <div v-else-if="error" class="text-white">
      Loading ...
    </div>
    <div v-else>
    <HomeContainer :folderIDSearched="folderIDSearched
    "/>
    </div>
  </div> 
</template>

<script setup>

const route = useRoute()
const router = useRouter()
const folderIDSearched = ref(1)
// Search if this path exist on the api, if not, redirect to 404, if yes, render the page with the data
const baseURL = "https://api.drive.altab.tech/api"

const path = route.params.slug
const _folderName = path[path.length - 1].toLocaleLowerCase()
const { pending, data: res, refresh, error } = useAsyncData('path', () => $fetch(`${baseURL}/folders/search/${_folderName}`))
const pathExist = path.join('/')

onMounted(() => {
  if(res.value) {
    folderIDSearched.value = res.value[0].folder.id
    if (pathExist) {
  
      
      }
    } else {
        router.push('/404')
      }
})

</script>