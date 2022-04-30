<template>
  <div
    class="flex flex-col items-center w-4/5 h-screen m-auto text-white md:w-3/5 lg:w-2/5 z-20"
  >
    <!-- <h3 class="mt-32 Text"> Contact us </h3> -->
    <div
      class="mt-8 text-white uppercase duration-1000 lg:mt-16 stroke font-montserrat ease-out-quint whitespace-nowrap"
    >
      <h3 class="text-xl uppercase">Contact</h3>
    </div>
    <p>[ 🇫🇷 | 🇺🇸 | 🇪🇸 ]</p>
    <p v-if="info">{{info}}</p>
    <form
      class="w-full mt-4 grid gap-6 font-text"
      name="contact"
      netlify
      data-netlify-honeypot="bot-field"
      @submit.prevent="handleSubmit"
    >
      <p class="hidden">
        <label>Don’t fill this out if you’re human: <input name="bot-field" /></label>
      </p>
      <input type="hidden" name="form-name" value="contact" />
      <AltabTextInput v-model="email" type="email" name="email" placeholder="E-mail" center>
        <AltabAppAtIcon />
        <template #input="{ className, id, inputName, placeholder, value, input }">
          <input
            :id="id"
            :name="inputName"
            :value="value"
            :placeholder="placeholder"
            :class="className"
            @input="input"
          />
        </template>
      </AltabTextInput>
      <AltabTextInput v-model="name" type="text" name="name" placeholder="Name" center>
        <AltabAppPersonIcon />
        <template #input="{ className, id, inputName, placeholder, value, input }">
          <input
            :id="id"
            :name="inputName"
            :value="value"
            :placeholder="placeholder"
            :class="className"
            @input="input"
          />
        </template>
      </AltabTextInput>
      <AltabTextInput v-model="object" type="text" name="object" placeholder="Object" center>
        <AltabAppLabelIcon />
        <template #input="{ className, id, inputName, placeholder, value, input }">
          <input
            :id="id"
            :name="inputName"
            :value="value"
            :placeholder="placeholder"
            :class="className"
            @input="input"
          />
        </template>
      </AltabTextInput>
      <AltabTextInput v-model="message" name="message" placeholder="Message">
        <AltabAppTextIcon />
        <template #input="{ className, id, inputName, placeholder, value, input }">
          <textarea
            :id="id"
            :name="inputName"
            :value="value"
            :placeholder="placeholder"
            :rows="rows"
            class="resize-none"
            :class="className"
            @input="input"
          ></textarea>
        </template>
      </AltabTextInput>
      <div class="flex justify-between">
        <p
          class="underline cursor-pointer font-montserrat"
          @click="openMailto"
        >
          contact@altab.tech
        </p>        

        <button type="submit">
          Send
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
const email = ref("");
const name = ref("");
const object = ref("");
const message = ref("");
const rows = ref(10);
const info = ref('')

function createFormDataObj(data) {
  const formData = new FormData();
  for (const key of Object.keys(data)) {
    formData.append(key, data[key]);
  }
  return formData;
}

function handleSubmit() {
  if (email.value == "" || name.value == "" || object.value == "" || email.value == "") {
    info.value = "Invalid input. Please verify any informations provided.";
  } else {
    const data = {
      "form-name": "contact",
      email: email.value,
      name: name.value,
      object: object.value,
      message: message.value,
    };
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(createFormDataObj(data)).toString(),
    })
      .then((res) =>
        info.value =  res.ok ? "Thanks for your message !" : "An error occured !"
      )
      .catch(() => info.value = "An error occured !");
  }
}

function openMailto() {
  window.open('mailto:contact@alteb.tech');
}

onMounted(() => {
    console.log(navigator)
})
</script>

<style></style>
