<template>
  <div class="flex flex-col pt-40 w-full h-screen text-white bg-primary-dark z-50">
    <form @submit.prevent="login" class="flex flex-col w-full max-w-xl mx-auto">
      <h1 class="text-4xl w-full text-center mb-3">Se connecter</h1>

      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" autocomplete="email" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg mb-3" />

      <label for="password">Mot de passe</label>
      <input type="password" id="password" v-model="password" autocomplete="new-password" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg mb-3" />
      
      <!-- Check box remember me -->
      <div class="flex flex-row items-center space-x-3">
        <input type="checkbox" id="remember" v-model="remember" class="border-2 text-black border-gray-600 rounded-lg" />
        <label for="remember">Se souvenir de moi</label>
      </div>

      <AltabButton type="submit" class="w-80 self-center mt-4" Title="Se connecter" Color="black" Size="medium"/>

    </form>
  </div>  
</template>

<script>
import axios from 'axios'
let APIurl = 'http://127.0.0.1:3333/api'
// const { $store } = useNuxtApp()


export default {
  data() {
    return {
      email: '',
      password: '',
      remember: false
    }
  },
  methods: {
    login() {
        console.log('Try to log')
      // document event to say that the user is logged
      axios.post(APIurl+'/login', {
        email: this.email,
        password: this.password,
        remember: this.remember,
      })
      .then(response => {
        console.log('Try to log', response.status)
        if(response.status === 200) {
          console.log('Login...', response)
          let user = response.data.user
          localStorage.setItem('isLogged', true)
          localStorage.setItem('user.name', user.first_name)
          localStorage.setItem('user.id', user.id)
          this.$router.push('/')
          document.dispatchEvent(new Event('session-change'))
        }        
      }).catch(error => {
        console.log('Try to log', error)
      })
    }
  }
}
</script>