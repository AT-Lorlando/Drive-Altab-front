<template>
  <div class="flex flex-col items-center w-full h-full bg-black">
    <canvas
      id="threecanvas"
      ref="canvas"
      class="absolute w-screen h-screen inset-0 z-0"
    ></canvas>
    <div class="pl-12 w-full text-white text-4xl z-10">
      <button v-for="f in path" class="pathButton" @click="gotoFile(f)">
        {{ `/` + f.title }}
      </button>
    </div>
    <!-- TODO: Sparkles -->
        <SubContainer :currentPage="folder" ref="Scene" :gotoFile="gotoFile" />


    <ModalLocked
      v-if="lockedModal"
      :close="
        () => {
          this.lockedModal == false;
        }
      "
      :confirm="confirmModal"
      :title="'Test'"
    />

    <ModalPhoto
      v-if="photoModal"
      :close="closeModal"
      :photo="photo"
      :next="nextPhoto"
      :previous="previousPhoto"
      ref="Photo"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, provide, defineAsyncComponent } from "vue";
import axios from "axios";
let APIurl = "http://127.0.0.1:3333/api";

// const ThreeComponent = defineAsyncComponent(() => import("../Sub/Container.vue"));

const props = defineProps({
  searchedPath: {
    type: Array,
    default: [],
  },
});

const path = ref([]);
const folder = ref([]);
let lockedModal = false;
let photoModal = false;
let photo = {};
let focusedFile = null;

const isLoading = ref(false);
const Scene = ref(null);
const Photo = ref(null);

async function gotoFile(f) {
  console.log("%cGOTOFILE", "color: red; font-size: 20px", f);
  if (f.title != "Home") {
    path.value.push(f);
  }
  if (f.password != "") {
    lockedModal = true;
  }
  await openFile(f)
}

async function openFile(f) {
  lockedModal = false;
  photoModal = false;
  console.log("Open", f);
  if (path.value.length > 1) {
    path.value = path.value.slice(0, path.value.lastIndexOf(f) + 1);
  } else {
    path.value = [{ id: 1, title: "Home", password: "", type: "Folder" }];
  }
  if (f.type == "Folder") {
    isLoading.value = true;
    await fetch_folder(`/folders/${f.id}`)
  } else if (f.type == "image") {
    photo = f;
    photoModal = true;
  }
}

async function fetch_folder(url) {
  console.log("Fetch folder", APIurl + url);
  await axios.get(APIurl + url).then((res) => {
    console.log(res.data);
    if (res.data.images.data.length > 0) {
      // We have images
      const data = res.data.images.data;
      folder.value = data.map((e) => {
        return {
          id: e.id,
          title: e.title,
          data: APIurl.replace("/api", "") + e.data.url,
          width: "e.imageWidth",
          height: "e.imageHeight",
          date: "04/12/2000",
          size: 420,
          type: "image",
        };
      });
    } else {
      // We have subfolders
      const data = res.data.childs;
      folder.value = data?.map((f) => {
        return {
          id: f.id,
          title: f.name,
          type: "Folder",
          password: "",
        };
      });
    }
  });
}

function closeModal(s) {
  // Scene._value.focusedFile = null;
  // Scene._value.folderDisplay.style.visibility = "visible";
  if (s == "locked") {
    lockedModal = false;
  } else if (s == "photo") {
    photoModal = false;
    path.value.pop();
  }
}

function nextPhoto() {
  path.value.pop();
  let f = folder[(folder.indexOf(photo) + 1) % folder.length];
  // Scene._value.focusedFile = f
  // Scene._value.fileIndex = folder.indexOf(f)
  photo = f;
  gotoFile(f);
  Photo._value.setPhoto(f);
}

function previousPhoto() {
  path.value.pop();
  let f = folder[(folder.indexOf(photo) - 1 + folder.length) % folder.length];
  // Scene._value.focusedFile = f
  // Scene._value.fileIndex = folder.indexOf(f)
  photo = f;
  gotoFile(f);
  Photo._value.setPhoto(f);
}

async function lookForPath() {
  let searchedFile = props.searchedPath[props.searchedPath.length - 1];
  if (searchedFile && searchedFile?.id != 1) {
    await axios.get(APIurl + "/folders").then((res) => {
      let pack = res.data.find(
        (f) => f.folder.name.toLowerCase() == searchedFile.toLowerCase()
      );
      let folderPath = pack.path
      let folder = pack.folder
      if (folder) {
          path.value = folderPath.map((f) => {
            return {
              id: f.id,
              title: f.name,
              password: "",
              type: "Folder",
            };
          });
        path.value.push({ id: folder.id, title: folder.name, password: "", type: "Folder" });
        console.log("Draw ", folder);
        fetch_folder(`/folders/${folder.id}`).then(() => {});
      }
    });
  } else {
    console.log("No path to look for");
    console.log("Draw home");
    path.value = [{ id: 1, title: "Home", password: "", type: "Folder" }];
    await fetch_folder(`/folders/${path.value[0].id}`);
  }
  console.log(folder);
}

onMounted(() => {
  console.log(Scene);
  console.log("Mounted");
  lookForPath();
});

provide("path", path);
provide("folder", folder);
</script>

<style scoped>
.pathButton {
  @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform;
}
</style>
