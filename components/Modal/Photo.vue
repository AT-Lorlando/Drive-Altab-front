<template>
  <div
    class="fixed xl:absolute xl:mt-20 z-20 w-full h-full xl:h-4/6 flex flex-col xl:flex-row text-white justify-between items-center"
  >
    <div v-if="isMobile" class="w-1/3 h-full p-4">
      <h1 class="text-3xl">Informations sur la photo</h1>
      <div class="flex flex-col space-y-1 m-4">
        <div v-for="i in informations" class="flex flex-row w-1/2 justify-between">
          <p class="text-xl text-center pb-1">{{ i.name }}:</p>
          <p class="text-xl text-center pb-1">{{ i.value }}</p>
        </div>
      </div>
    </div>
    <div v-else class="w-4/5 p-4 mt-10">
      <h1 class="text-base">Informations sur la photo:</h1>
      <div class="grid grid-cols-2 space-y-1">
        <div v-for="i in informations" class="flex flex-row w-1/2 justify-between">
          <p class="text-sm text-center pb-1">{{ i.name }}:</p>
          <p class="text-sm text-center pb-1">{{ i.value }}</p>
        </div>
      </div>
    </div>
    <div v-if="isMobile" class="flex flex-row w-1/3 justify-between px-4 h-full">
      <button class="bg-transparent" @click="previous">
        <IconsLeftArrow class="icons" />
      </button>
      <button
        class="bg-transparent w-full h-full hover:cursor-pointer"
        @click="fullscreen"
      ></button>
      <button class="bg-transparent" @click="next">
        <IconsRightArrow class="icons" />
      </button>
    </div>
    <div v-if="isMobile" class="w-1/3 h-auto px-4 pl-20 space-y-8 my-auto flex flex-col">
      <AltabButton :click="download" Title="Télécharger" Color="black" Size="large" />
      <AltabButton
        Type="link"
        :Route="`/contact-edit${photo.id}`"
        Title="Demander une retouche"
        Color="black"
        Size="large"
      />
      <AltabButton Type="link" Route="/exemples" Title="Voir des exemples de retouches" Color="black" Size="large" />
      <AltabButton
        Type="link"
        :Route="`/contact-help${photo.id}`"
        Title="Demander de l'aide"
        Color="black"
        Size="large"
      />
      <AltabButton :click="close" Title="Fermer" Color="black" Size="large" />
      <AltabButton
        :click="previousPage"
        :biclick="nextPage"
        Title="Page précédente"
        Color="black"
        Size="large"
        Type="bibutton"
        biTitle="Page suivante"
      />
    </div>
    <div v-else class="fixed left-0 bottom-0 w-full h-auto flex flex-col space-y-2 mb-2 text-sm">
      <AltabButton
        Type="bibutton"
        :click="previous"
        :biclick="next"
        Title="Photo précédente"
        Color="black"
        Size="medium"
        biTitle="Photo suivante"
      />
      <AltabButton
        Type="bibutton"
        :click="download"
        :biclick="close"
        Title="Télécharger"
        Color="black"
        Size="medium"
        biTitle="Fermer"
      />
      <AltabButton Type="link" Route="/exemples" Title="Voir des exemples de retouches" Color="black" Size="medium" />
      <AltabButton
        Type="bilink"
        :Route="`/contact-help${photo.id}`"
        :biRoute="`/contact-edit${photo.id}`"
        Title="Demander de l'aide"
        biTitle="Demander une retouche"
        Color="black"
        Size="medium"
      />
    </div>

    <div
      v-if="showFullscreen"
      class="fixed z-30 flex flex-col w-full h-full items-center justify-center bg-white bg-opacity-20"
    >
      <div class="absolute self-center">
        <img
          :src="`${baseURL}${photo.data.url}`"
          class="object-scale-down rounded-xl max-w-screen-xl max-h-screen shadow-lg border-white border-2 bg-blend-luminosity"
        />
        <IconsExit
          class="absolute top-0 right-0 m-8 hover:cursor-pointer"
          @click="closeFullscreen"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close", "next", "previous", "nextPage", "previousPage"]);
const baseURL = "https://api.drive.altab.tech";

let informations = ref([]);
const showFullscreen = ref(false);
const fullsize = ref(null);
const photo = inject("focusedFile");

watch(photo, (newPhoto) => {
  if (newPhoto) {
    setPhoto(newPhoto);
  }
});

function download () {
  window.open(`${fullsize.value}`);
}

function fullscreen() {
  showFullscreen.value = true;
}

function closeFullscreen() {
  showFullscreen.value = false;
}

function close() {
  emit("close");
}

function next() {
  emit("next");
}

function previous() {
  emit("previous");
}

function nextPage() {
  emit("nextPage");
}

function previousPage() {
  emit("previousPage");
}

function setPhoto(photo) {
  informations.value = [
    {
      name: "Nom",
      value: photo.title,
    },
    {
      name: "Date",
      value: photo.updated_at.split("T")[0].split("-").reverse().join("/"),
    },
    {
      name: "Taille",
      value: (photo.data.size * 0.00095367432).toFixed(2) + "Mb",
    },
    {
      name: "Dimensions",
      value: photo.data.width + "x" + photo.data.height,
    },
    {
      name: "Type",
      value: photo.data.format,
    },
  ];
  fullsize.value = `${baseURL}${photo.data.url}`
}
const isMobile = inject("isMobile");

onMounted(() => {
  setPhoto(photo.value);
});
</script>

<style scoped>
.icons {
  @apply w-16 h-16 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center;
}
</style>
