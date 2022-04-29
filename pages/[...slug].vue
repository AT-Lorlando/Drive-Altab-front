<template>
  <div class="h-full w-full">
    <HomeContainer />
  </div> 
</template>

<script setup>
import { onMounted } from 'vue';
const route = useRoute()
const router = useRouter()

// Search if this path exist on the api, if not, redirect to 404, if yes, render the page with the data
const path = route.params.slug
const pathExist = path.join('/')
console.log(pathExist)

onMounted(() => {
  if (pathExist) {

  } else {
    router.push('/404')
  }
})

</script>