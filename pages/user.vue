<template>
  <div class="flex flex-col pt-40 w-full h-screen text-white bg-primary-dark z-50">
    {{first_name}} - {{last_name}} - {{email}}
  </div>  
</template>

<script setup>
import axios from 'axios'
let APIurl = "https://api.drive.altab.tech/api"

// Fetch user informations
const id = 0
const first_name = ref('first_name')
const last_name = ref('last_name')
const email = ref('email')

onMounted(() => {
  // Fetch user informations
  const id = localStorage.getItem('user.id')
  if (id) {
    axios.get(APIurl+'/user/'+id)
      .then(response => {
        first_name.value = response.data.first_name
        last_name.value = response.data.last_name
        email.value = response.data.email
      })
  }
})

</script>