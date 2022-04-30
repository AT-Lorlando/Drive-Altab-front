<template>
  <div
    class="absolute mt-20 z-20 w-full h-4/6 flex flex-row text-white justify-between items-center"
  >
    <div class="w-1/3 h-full p-4">
      <h1 class="text-3xl">Informations sur la photo</h1>
      <div class="flex flex-col space-y-1 m-4">
        <div v-for="i in informations" class="flex flex-row w-1/2 justify-between">
          <p class="text-xl text-center pb-1">{{ i.name }}:</p>
          <p class="text-xl text-center pb-1">{{ i.value }}</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row w-1/3 justify-between px-4 h-full">
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
    <div class="w-1/3 h-auto px-4 pl-20 space-y-8 my-auto flex flex-col">
      <AltabButton :click="download" Title="Télécharger" Color="black" Size="large" />
      <AltabButton
        :click="askforEdit"
        Title="Demander une retouche"
        Color="black"
        Size="large"
      />
      <AltabButton :click="askforHelp" Title="Demander de l'aide" Color="black" Size="large" />
      <AltabButton :click="close" Title="Fermer" Color="black" Size="large" />
      <AltabButton :click="previousPage" :biclick="nextPage" Title="Page précédente" Color="black" Size="large" Type="bibutton" biTitle="Page suivante" />
    </div>
  </div>
</template>

<script setup>
const emit = defineEmits(["close","fullscreen", "next", "previous", "nextPage", "previousPage"]);
const props = defineProps({
  photo: {
    type: Object,
    default: {},
  },
});

let currentPhoto = props.photo;
let informations = [
  {
    name: "Taille",
    value: currentPhoto.size,
  },
  {
    name: "Type",
    value: currentPhoto.type,
  },
  {
    name: "Dimensions",
    value: currentPhoto.width + "x" + currentPhoto.height,
  },
  {
    name: "Nom",
    value: currentPhoto.title,
  },
  {
    name: "Date",
    value: currentPhoto.date,
  },
];
let fullSize = null;

function fullscreen() {
  console.log("fullscreen");
  emit('fullscreen')
  // Fetch the photo in its original size if it's not already done, then display it in fullscreen
  // this.fetchPhoto();
}

function close() {
  console.log("close")
  emit('close')
}

function next() {
  emit('next')
}

function previous() {
  emit('previous')
}

function nextPage() {
  emit('nextPage')
}

function previousPage() {
  emit('previousPage')
}

function askforHelp() {
  console.log('Ask for help')
}

function askforEdit() {
  console.log('Ask for edit')
}

function fetchPhoto() {
  if (this.fullSize == null) {
    console.log("Fetch photo", this.currentPhoto.id, "in fullsize");
  }
  this.fullSize = true;
}

function setPhoto(photo) {
  this.informations = [
    {
      name: "Taille",
      value: photo.size,
    },
    {
      name: "Type",
      value: photo.type,
    },
    {
      name: "Dimensions",
      value: photo.width + "x" + photo.height,
    },
    {
      name: "Nom",
      value: photo.title,
    },
    {
      name: "Date",
      value: photo.date,
    },
  ];
  this.currentPhoto = photo;
}
</script>

<style scoped>
.icons {
    @apply w-16 h-16 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center
}
</style>
