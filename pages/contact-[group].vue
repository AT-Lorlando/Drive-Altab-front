<template>
  <KinesisContainer class="h-full z-20 overflow-clip bg-primary-dark xl:pl-0 pl-8 xl:mt-20">
    <KinesisElement
      class="flex flex-col items-center pl-8 xl:pl-0 xl:w-3/5 h-full m-auto text-white"
      :strength="4"
      type="depth"
    >
      <!-- <h3 class="mt-32 Text"> Contact us </h3> -->
      <div
        class="mt-8 text-white uppercase duration-1000 lg:mt-16 stroke ease-out-quint whitespace-nowrap"
      >
        <h3 class="text-xl uppercase">Contact</h3>
      </div>
      <p>[ 🇫🇷 | 🇺🇸 | 🇪🇸 ]</p>
      <p class="text-red-500">Le formulaire ne fonctionne pas encore...</p>
      <p v-show="error" class="text-red-400">{{ error }}</p>
      <p v-show="confirm" class="text-teal-500">{{ confirm }}</p>
      <form
        class="w-4/5 mt-4 flex flex-col space-y-6 font-text text-lg justify-center items-center"
        name="contactDrive"
        id="contactForm"
        method="post"
        @submit.prevent="sendForm"
      >
        <p class="hidden">
          <label>Don't fill this out if you're human: <input name="bot-field" /></label>
        </p>

        <div class="containerInput">
          <AltabAppAtIcon class="icons" />
          <input v-model="email" class="formInput" type="text" name="email" placeholder="Email"/>
        </div>
        <div class="containerInput">
          <AltabAppPersonIcon class="icons" />
          <input v-model="name" class="formInput" type="text" name="name" placeholder="Nom"/>
        </div>
        <div class="containerInput">
          <AltabAppLabelIcon class="icons" />
          <input ref="objectInput" v-model="mailObject" class="formInput" type="text" name="object" placeholder="Objet"/>
        </div>
        <div class="containerInput">
          <AltabAppTextIcon class="icons" />
          <textarea v-model="message" :rows="rows" class="formInput" type="text" name="message" placeholder="Votre message"/>
        </div>

        <div class="flex flex-col xl:flex-row justify-between space-y-4 xl:space-y-0">
          <p class="underline cursor-pointer self-center" @click="openMailto">
            contact@altab.tech
          </p>
          <AltabButton class="hover: cursor-not-allowed" type="submit" Title="Envoyer" Color="black" Size="medium" />
        </div>
      </form>
    </KinesisElement>
  </KinesisContainer>
</template>

<script setup>
import axios from 'axios'
import { KinesisContainer, KinesisElement } from "vue-kinesis";
const route = useRoute()
const objectInput = ref(null)
const rows = ref(10);
const error = ref("");
const confirm = ref("");
const id = ref(null);
const email = ref("")
const name = ref("")
const mailObject = ref("")
const message = ref("")
let preMailObject = ""
const baseURL = "https://api.drive.altab.tech/api";


function sendForm() {
  if (email.value == "" || name.value == "" || mailObject.value == "" || message.value == "") {
    error.value = "Invalid input. Please verify any informations provided.";
  } else {
    // Post the from data to the API
    axios.post(`${baseURL}/mail`, {
      from: email.value + " <" + name.value + ">",
      object: mailObject.value,
      value: message.value,
      img_id: id.value
    })
    .then(function (response) {
      if (response.data.status == "success") {
        confirm.value = "Your message has been sent.";
        email.value = "";
        name.value = "";
        mailObject.value = "";
        message.value = "";
        objectInput.value.focus();
      } else {
        error.value = "An error occured. Please try again later.";
      }
    })
    .catch(function (error) {
      error.value = "An error occured. Please try again later.";
    });
  }
}

function openMailto() {
  window.open("mailto:contact@alteb.tech");
}

onMounted(() => {
  let contactType = route.params.group;
  if(contactType == "me") {
  }
  // Else if the contact type is a regex (ex: edit10), we get the id from the regex
  else if (contactType.match(/^edit\d+$/)) {
    id.value = contactType.replace("edit", "");
    contactType = "edit";
    preMailObject = "[photo " + id.value+ "]" + " Demande de modification";
    mailObject.value = preMailObject;

  } else if (contactType.match(/^help\d+$/)) {
    id.value = contactType.replace("help", "");
    contactType = "help";
    preMailObject = "[photo " + id.value+ "]" + " Demande d'aide";
    mailObject.value = preMailObject;
  }
});
</script>

<style scoped>
.formInput {
  @apply pl-2 w-full bg-transparent focus:outline-none
}

.containerInput {
  @apply flex flex-row rounded-md border-2 border-white pl-2 pb-1 pt-2 xl:w-full w-80
}

</style>
