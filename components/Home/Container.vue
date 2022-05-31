<template>
  <div class="h-screen overflow-y-clip flex flex-col pl-16 xl:pl-0 items-center bg-primary-dark text-white">
    <div class="w-full xl:w-3/5 text-center self-center text-2xl xl:text-5xl mt-20" v-if="pending">Loading ...</div>
    <div class="w-full xl:w-3/5 text-center self-center text-2xl xl:text-5xl mt-20" v-else-if="error">Une erreur est survenue. <br>Désolé!</div>
    <div v-else class="">
      <div class="fixed pt-4 xl:pl-16 flex flex-row w-screen overflow-clip justify-arround items-center bg-primary-dark z-20">
        <div class="bg-primary-dark flex flex-row items-center">
          <SubPath @pathClick="onPathClick" />
        </div>
        <p class="text-xl xl:text-3xl pl-6">{{ page }}/{{lastPage}}</p>
      </div>
      <SubContainer
        :folder="
          folderData?.childs?.length ? folderData?.childs : folderData?.images.data
        "
        @sceneClick="onSceneClick"
      />
      <div
        v-if="isMobile"
        v-show="!showPhotoModal && !showLockedModal"
        class="absolute flex flex-row w-full justify-between inset-0 px-4 z-20 h-20 top-1/2"
      >
        <button class="bg-transparent h-auto" @click="previousPage">
          <IconsLeftArrow class="icons" />
        </button>
        <button class="bg-transparent h-auto" @click="nextPage">
          <IconsRightArrow class="icons" />
        </button>
      </div>
      <div
        v-else-if="!isMobile.value"
        v-show="!showPhotoModal && !showLockedModal"
        class="fixed left-0 right-0 bottom-0 w-full z-20 pb-4 flex flex-row justify-center"
      >
        <AltabButton Type="bibutton" Title="Page précédente" biTitle="Page suivante" Size="medium" color="white" :biclick="nextPage" :click="previousPage" />
      </div>
    </div>

    <ModalLocked v-if="showLockedModal" />

    <ModalPhoto
      v-if="showPhotoModal"
      @close="closePhotoModal"
      @previous="previousPhoto"
      @next="nextPhoto"
      @fullscreen="fullscreen"
      @nextPage="nextPage"
      @previousPage="previousPage"
    />
  </div>
</template>

<script setup>
// Get the actual folder (An array[10] of files / subfolders), and provide it to the subcontainer (wich will draw the content)
// A file is an object with the following properties:
// {
//   title: "File title",
//   type: "Image",
//   path: "File path",
//   data: "File data",
// }
// A folder is an object with the following properties:
// {
//   title: "Folder title",
//   type: "Folder",
//   path: "Folder path",
//   isLocked: "Boolean", // If true, the folder is locked, and the user must unlock it to see the content with a password
// }

// On first, get the Home folder (the root folder), exept if there is a path on path props, then get the folder with the path
const props = defineProps({
  folderIDSearched: {
    type: Number,
    default: 1,
  },
});
const baseURL = "https://api.drive.altab.tech/api";
const isMobile = inject('isMobile')
const showPhotoModal = ref(false);
const showLockedModal = ref(false);
const photoDisplayed = ref(null);
const totalFiles = ref(0);
const lastPage = ref(1);
const actualPath = ref([
  {
    name: "Home",
    id: 1,
  },
]);
const folderID = ref(props.folderIDSearched);
provide("path", actualPath);
provide("focusedFile", photoDisplayed);
const page = ref(1);

const { pending, data: folderData, refresh, error } = useLazyAsyncData("folderData", () =>
  $fetch(`${baseURL}/folders/${folderID.value}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    params: {
      page: page.value,
    },
  }).then(
  )
);

// Watch on folderData, to add the type on each element and update the path
watch(folderData, (newfolderData) => {
  if (newfolderData.childs.length > 0) {
    folderData.value.childs.forEach((element) => {
      element.type = "Folder";
    });
    lastPage.value = 1;
    totalFiles.value = folderData.value.childs.length;
  } else {
    folderData.value.images.data.forEach((element) => {
      element.type = "Image";
    });
    lastPage.value = folderData.value.images.meta.last_page;
    totalFiles.value = folderData.value.images.meta.total;
  }

  actualPath.value = folderData.value.path ? folderData.value.path : [];
  actualPath.value.reverse();

  // actualPath.value.forEach(element => {
  // Add the element name to the url without refreshing the page
  // document.location = `/${element.name.toLocaleLowerCase()}`
});

function nextPage() {
    closePhotoModal();
  closeLockedModal();
  page.value < lastPage.value ? (page.value += 1) : (page.value = 1);
  refresh();
}

function previousPage() {
    closePhotoModal();
  closeLockedModal();
  page.value > 1 ? (page.value--) : (page.value = lastPage.value);
  refresh()
}

/* Function to handle the click on a scene, wich represent a file or a subfolder.
 * 1) First, check if the file type. If it's a file, open the modal with the file data. If it's a folder, check if it's locked.
 * If it's locked, open the modal with the folder data. If it's not locked, fetch the folder.
 *
 * While the folder is loading, show a loading message.
 *
 */
function onSceneClick(index) {
  if (folderData.value.childs[index]) {
    // It's a file
    const folder = folderData.value.childs[index];
    if (folder.isLocked) {
      showLockedModal.value = true;
    } else {
      folderID.value = folder.id;
      refresh();
    }
  } else if (folderData.value.images.data[index]) {
    // It's an image
    const image = folderData.value.images.data[index];
    showPhotoModal.value = true;
    photoDisplayed.value = image;
  }
}

function onPathClick(f) {
  folderID.value = f.id;
  closePhotoModal();
  closeLockedModal();
  refresh();
}

// Handle modal part

/* LOCKED MODAL */

function closeLockedModal() {
  showLockedModal.value = false;
}

/* PHOTO MODAL */

// Function to handle the photo modal:
function closePhotoModal() {
  document.dispatchEvent(new Event("close-photo-modal"));
  showPhotoModal.value = false;
  photoDisplayed.value = null;
}

// Function to handle the click on the next button in the modal
function nextPhoto() {
  const index = folderData.value.images.data.indexOf(photoDisplayed.value);
  if (index < folderData.value.images.data.length - 1) {
    photoDisplayed.value = folderData.value.images.data[index + 1];
  } else {
    // Fetch the next page and display the first image
    nextPage();
    photoDisplayed.value = folderData.value.images.data[0];
}
}

// Function to handle the click on the next button in the modal
function previousPhoto() {
  const index = folderData.value.images.data.indexOf(photoDisplayed.value);
  if (index > 0) {
    photoDisplayed.value = folderData.value.images.data[index - 1];
  } else {
    // Fetch the previous page and display the last image
    previousPage();
    photoDisplayed.value = folderData.value.images.data[folderData.value.images.data.length - 1];
  }
}

function fullscreen() {
}

onMounted(() => {
  document.addEventListener("go-home", (e) => {
    closePhotoModal();
    closeLockedModal();
    refresh()
    document.dispatchEvent(new Event("close-photo-modal"));
    folderID.value = 1;
  });
});
</script>


<style scoped>
.icons {
    @apply w-16 h-16 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center
}
</style>
