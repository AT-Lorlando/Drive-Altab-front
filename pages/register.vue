<template>
  <div class="flex flex-col pt-40 w-full h-screen text-white bg-primary-dark z-50">
    <form @submit.prevent="register" class="flex flex-col w-full max-w-xl mx-auto">
      <h1 class="text-4xl w-full text-center">S'inscrire</h1>
      <div class="flex flex-row space-x-4 my-3">
        <div class="w-1/2">
          <label for="first_name">Prénom</label>
          <input type="text" id="first_name" v-model="first_name" autocomplete="name" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg" />
        </div>
        <div class="w-1/2">
          <label for="last_name">Nom</label>
          <input type="text" id="last_name" v-model="last_name" autocomplete="family-name" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg" />      
        </div>
      </div>

      <label for="email">Email</label>
      <input type="email" id="email" v-model="email" autocomplete="email" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg mb-3" />

      <label for="password">Mot de passe</label>
      <input type="password" id="password" v-model="password" autocomplete="new-password" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg mb-3" />

      <label for="confirmPassword">Confirmer le mot de passe</label>
      <input type="password" id="confirmPassword" v-model="confirmPassword" autocomplete="new-password" class="w-full border-2 text-black border-gray-600 p-2 rounded-lg mb-3" />

      <!-- Check box remember me -->
      <div class="flex flex-row items-center space-x-3">
        <input type="checkbox" id="remember" v-model="remember" class="border-2 text-black border-gray-600 rounded-lg" />
        <label for="remember">Se souvenir de moi</label>
      </div>


      <AltabButton type="submit" class="w-80 self-center mt-4" Title="S'inscrire" Color="black" Size="medium"/>

    </form>
  </div>  
</template>

<script>
import axios from 'axios'
const baseURL = "https://api.drive.altab.tech/api";

export default {
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
      remember: false
    }
  },
  methods: {
    register() {
      axios.post(baseURL+'/register', {
        email: this.email,
        password: this.password,
        remember: this.remember,
        first_name: this.first_name,
        last_name: this.last_name,
        confirmPassword: this.confirmPassword,
      })
      .then(response => {
        console.log(response)
      })
    }
  }
}
</script>