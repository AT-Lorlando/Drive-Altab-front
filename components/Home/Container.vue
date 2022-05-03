<template>
  <div class="flex flex-col items-center w-full h-full bg-primary-dark text-white">
    <div class="w-3/5 text-center self-center text-8xl mt-20" v-if="pending">Loading ...</div>
    <div class="w-3/5 text-center self-center text-8xl mt-20" v-else-if="error">Une erreur est survenue. <br>Désolé!</div>
    <div v-else class="w-full">
      <div class="flex flex-row w-full justify-between items-center px-12">
      <div class="flex flex-row items-center">
        <SubPath @pathClick="onPathClick" />
        <p v-if="totalFiles" class="ml-8 text-3xl">({{totalFiles}})</p>
      </div>
        <p v-if="lastPage" class="text-3xl">{{ page }}/{{lastPage}}</p>
      </div>
      <SubContainer
        :folder="
          folderData?.childs?.length ? folderData?.childs : folderData?.images.data
        "
        @sceneClick="onSceneClick"
      />
      <div
        v-if="lastPage.value > 1"
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
const router = useRouter();
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
const showPhotoModal = ref(false);
const showLockedModal = ref(false);
const photoDisplayed = ref(null);
const totalFiles = ref(0);
const lastPage = ref(0);
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
    },
    params: {
      page: page.value,
    },
  })
);

// Watch on folderData, to add the type on each element and update the path
watch(folderData, (newfolderData) => {
  if (newfolderData.childs.length > 0) {
    folderData.value.childs.forEach((element) => {
      element.type = "Folder";
    });
    lastPage.value = 0;
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
  photoDisplayed.value =
    folderData.value.images.data[(index + 1) % folderData.value.images.data.length];
}

// Function to handle the click on the next button in the modal
function previousPhoto() {
  const index = folderData.value.images.data.indexOf(photoDisplayed.value);
  photoDisplayed.value =
    folderData.value.images.data[
      index - 1 < 0 ? folderData.value.images.data.length - 1 : index - 1
    ];
}

function fullscreen() {
}

onMounted(() => {
  document.addEventListener("go-home", (e) => {
    closePhotoModal();
    closeLockedModal();
    document.dispatchEvent(new Event("close-photo-modal"));
    folderID.value = 1;
    // refresh()
  });
});
</script>


<style scoped>
.icons {
    @apply w-16 h-16 text-white hover:cursor-pointer hover:border-2 border-white rounded-xl hover:p-1 transition-all delay-75 ease-in-out self-center
}
</style>
