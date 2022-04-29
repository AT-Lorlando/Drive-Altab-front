<template>
  <div class="flex flex-col items-center w-full h-full bg-black">

    <p class="text-2xl text-white">
    <!-- {{folderData?.folder.name}} -->
    </p>

    <SubPath 
      @pathClick="onPathClick"
    />

    <div v-if="pending" class="text-white">
      Loading ...
    </div>
    <div v-else>
      <SubContainer 
      :folder="folderData?.childs?.length ? folderData?.childs : folderData?.images.data"
      @sceneClick="onSceneClick"
      />
    </div>

    <ModalLocked
      v-if="showLockedModal"
      :close="closeLockedModal"
    />

    <ModalPhoto
      v-if="showPhotoModal"
      :close="closePhotoModal"
      :photo="photo"
      :next="nextPhoto"
      :previous="previousPhoto"
      ref="Photo"
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
const baseURL = 'http://127.0.0.1:3333/api'
const showPhotoModal = ref(false)
const showLockedModal = ref(false)
const photoDisplayed = ref(null)
const actualPath = ref([{
  name: 'Home',
  id: 1,
}])
const folderID = ref(props.folderIDSearched)
provide('path', actualPath)
const page = ref(1);
const { pending, data: folderData, refresh, error } = useLazyAsyncData('count', () => $fetch(`${baseURL}/folders/${folderID.value}`))


// Watch on folderData, to add the type on each element and update the path
watch(folderData, (newfolderData) => {
  if (newfolderData.childs.length > 0) {
    folderData.value.childs.forEach(element => {
      element.type = 'Folder'
    }); 
  } else {
    folderData.value.images.data.forEach(element => {
      element.type = 'Image'
    }); 
  }

  actualPath.value = folderData.value.path ? folderData.value.path : []
  actualPath.value.reverse()
})

/* Function to handle the click on a scene, wich represent a file or a subfolder.
* 1) First, check if the file type. If it's a file, open the modal with the file data. If it's a folder, check if it's locked. 
* If it's locked, open the modal with the folder data. If it's not locked, fetch the folder.
* 
* While the folder is loading, show a loading message.
*
*/
function onSceneClick(index) {
  if(folderData.value.childs[index]) { // It's a file
    const folder = folderData.value.childs[index]
    if (folder.isLocked) {
      showLockedModal.value = true;
    } else {
      folderID.value = folder.id
      refresh();
    }
  } else if(folderData.value.images[index]) { // It's an image
    const image = folderData.value.images[index]
    showPhotoModal.value = true;
    photoDisplayed.value = image;
  }
}

function onPathClick(f) {
  console.log('Path click')
  console.log(f)
  folderID.value = f.id
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
  showPhotoModal.value = false;
  photoDisplayed.value = null;
}

// Function to handle the click on the next button in the modal
function nextPhoto() {
  const index = folderData.images.indexOf(photoDisplayed.value)
  photoDisplayed.value = folderData.images[index + 1 % folderData.images.length]
}

// Function to handle the click on the next button in the modal
function previousPhoto() {
  const index = folderData.images.indexOf(photoDisplayed.value)
  photoDisplayed.value = folderData.images[index - 1 < 0 ? folderData.images.length - 1 : index - 1]
}

onMounted(() => {
  console.log("Main container mounted")
})

</script>


