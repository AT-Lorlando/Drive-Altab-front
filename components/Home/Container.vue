<template>
  <div class="flex flex-col items-center w-full h-full bg-black">
        
    <div class="pl-12 w-full text-white text-4xl z-10">
      <button v-for="f in path" class="pathButton" @click="clickOnPath(f)">
        {{ `/` + f.title }}
      </button>
    </div>
    <!-- TODO: Sparkles -->
    <ul
      id="folderDisplay"
      class="grid grid-cols-5 w-full overflow-y-auto pt-12 px-12 bg-black"
    >
      <li
        v-for="index in 10"
        ref="sceneRefs"
        v-show="!focusedFile || focusedFile === file"
        :class="
          folder[index - 1]?.title
            ? 'h-80 w-auto z-10 hover:cursor-pointer'
            : 'h-80 w-auto z-10'
        "
        @click="onClick(folder[index - 1], index - 1)"
      >
        <h2 class="break-normal text-white text-center uppercase text-xl absolute w-80">
          {{ folder[index - 1]?.title }}
        </h2>
        <div
          :id="`scene${index - 1}`"
          @mouseover="hover(folder[index - 1])"
          class="w-80 h-80"
        />
      </li>
    </ul>

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
import { ref, onMounted, provide, inject, watch, onBeforeMount, onUnmounted } from "vue";
import axios from "axios";
import * as THREE from "three";
import img from "../../assets/imgs/img.png";
let APIurl = "http://127.0.0.1:3333/api";

let renderer, controls, size, clock, cameraGlobal;
let canvas;
const scenes = [];
const defaultScene = new THREE.Scene();
const mouse = new THREE.Vector2();
// Cube and plane parameters
const offset = 0.1;
const POS = [
  { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0 },
  { x: 0, y: 0, z: -(1 + 2 * offset), rx: 0, ry: Math.PI, rz: 0 },
  { x: 0, y: 0.5 + offset, z: -(0.5 + offset), rx: Math.PI / 2, ry: 0, rz: 0 },
  { x: 0, y: -(0.5 + offset), z: -(0.5 + offset), rx: -Math.PI / 2, ry: 0, rz: 0 },
  { x: 0.5 + offset, y: 0, z: -(0.5 + offset), rx: 0, ry: Math.PI / 2, rz: 0 },
  { x: -(0.5 + offset), y: 0, z: -(0.5 + offset), rx: 0, ry: -Math.PI / 2, rz: 0 },
];
let geometryCube, geometryPlane, texture, material;

// Stars parameters
const amount = 250;
const STARS = [];
const galaxyGeometryVertices = [];
const galaxyGeometryColors = [];
const galaxyGeometrySizes = [];
const starsGeometry = new THREE.BufferGeometry();
const hue = 215 / 360;
let INITIAL_POS = -1;
// let POS_MAX = INITIAL_POS
let POS_MAX = 1;
let StarsMaterial, galaxyPoints, pixelRatio;
const galaxyColors = [
  new THREE.Color().setHSL(hue, 1, 0.99),
  new THREE.Color().setHSL(hue, 1, 0.95),
  new THREE.Color().setHSL(hue, 1, 0.8),
  new THREE.Color().setHSL(hue, 1, 0.7),
  new THREE.Color().setHSL(hue, 1, 0.6),
];

const vertexshader = `
attribute float size;
attribute vec3 color;
attribute float fade;

varying vec3 vColor;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * 20.0/-mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}`;

const fragmentshader = `
uniform sampler2D pointTexture;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}`;

class Star {
  setup(color) {
    this.y = -1.25 + (Math.random() - 0.5) / 6;
    this.x = INITIAL_POS + Math.abs(this.y / -1.25 - 1);
    this.z = -1;
    (this.v = (Math.random() / 0.5) * 0.1 + 0.01), (this.initial_x = this.x);
    this.max_x = POS_MAX - Math.abs(this.y / -1.25 - 1);

    this.size = Math.random() * 0.01 + 0.5 * pixelRatio;
    this.color = color;
  }
  update() {
    this.x += this.v / 5;
    if (this.x > this.max_x) {
      this.x = this.initial_x;
      //   this.x -= 2;
    }
  }
}

function onMouseMove(event, size, camera) {
  mouse.x = (event.clientX - size.x) / size.width - 0.5;
  mouse.y = (event.clientY - size.y) / size.height - 0.5;

  camera.position.x += (mouse.x * 2 - camera.position.x) * 0.05;
  camera.position.y += (-mouse.y * 2 - camera.position.y) * 0.05;
}

function folderMesh(f) {
  if (f.type === "Folder") {
    // add 8 plane forming a cube
    const cube = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const mesh = new THREE.Mesh(geometryCube, material);
      mesh.position.x = POS[i].x;
      mesh.position.y = POS[i].y;
      mesh.position.z = POS[i].z + 0.5;

      mesh.rotation.x = POS[i].rx;
      mesh.rotation.y = POS[i].ry;
      mesh.rotation.z = POS[i].rz;
      cube.add(mesh);
    }
    cube.name = "toRotate";
    return cube;
  } else {
    // Add a plane facing the camera
    const new_texture = new THREE.TextureLoader().load(f.data);
    const new_material = new THREE.MeshBasicMaterial({
      map: new_texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometryPlane, new_material);
    mesh.position.x = 0;
    mesh.position.y = 0;
    mesh.position.z = 0;
    mesh.name = "toRotate";
    return mesh;
  }
}

const props = defineProps({
  searchedPath: {
    type: Array,
    default: [],
  },
});

const path = ref([]);
const folder = ref([]);
fillFolder();

let lockedModal = false;
let photoModal = false;
let photo = {};
let focusedFile = null;
let fileIndex = null;
let folderDisplay = null;
let ID = null

const isLoading = ref(false);
const Photo = ref(null);

async function gotoFile(f) {
  console.log("%cGOTOFILE", "color: red; font-size: 20px", f);
  if (f.title != "Home") {
    path.value.push(f);
  }
  if (f.password != "") {
    lockedModal = true;
  }
    startLoading(f)
  await openFile(f);
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
    console.log('lookForPath', searchedFile)
  if (searchedFile && searchedFile.toLowerCase() != 'home') {
    await axios.get(APIurl + "/folders").then((res) => {
      let pack = res.data.find(
        (f) => f.folder.name.toLowerCase() == searchedFile.toLowerCase()
      );
      let folderPath = pack.path;
      let folder = pack.folder;
      console.log("FOLDERPATH", folderPath);
      if (folder) {

        path.value = folderPath.map((f) => {
          return {
            id: f.id,
            title: f.name,
            password: "",
            type: "Folder",
          };
        });
        path.value.push({
          id: folder.id,
          title: folder.name,
          password: "",
          type: "Folder",
        });
      }
    });
  } else {
    console.log("No path to look for");
    console.log("Draw home");
    path.value = [{ id: 1, title: "Home", password: "", type: "Folder" }];
  }
  console.log(folder);
  await fetch_folder(`/folders/${path.value[path.value.length - 1].id}`).then(
    () => {
      draw_Folder()
    }
  );

}

function fillFolder() {
  while (folder.value.length < 10) {
    folder.value.push({
      id: 0,
      title: "",
      data: "",
      width: 0,
      height: 0,
      date: "",
      size: 0,
      type: "fill",
    });
  }
}

function init() {
  canvas = document.getElementById(`threecanvas`);
  size = canvas.getBoundingClientRect();
  clock = new THREE.Clock();
  renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff, 0);
  renderer.setScissorTest(true);
  renderer.setSize(size.width, size.height);

  pixelRatio = renderer.getPixelRatio();

  cameraGlobal = new THREE.PerspectiveCamera(75, size.width / size.height, 0.1, 1000);
  cameraGlobal.position.z = 2.5;

  StarsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      pointTexture: {
        value: new THREE.TextureLoader().load("../../assets/imgs/dotTexture.png"),
      },
    },
    vertexShader: vertexshader,
    fragmentShader: fragmentshader,
    blending: THREE.AdditiveBlending,
    alphaTest: 1.0,
    transparent: true,
  });

  geometryCube = new THREE.PlaneGeometry(1, 1);
  geometryPlane = new THREE.PlaneGeometry(1.6, 1.6);
  texture = new THREE.TextureLoader().load(img);
  material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });

  for (let i = 0; i < amount; i++) {
    let star = new Star();
    star.setup(galaxyColors[Math.floor(Math.random() * galaxyColors.length)]);
    galaxyGeometryVertices.push(star.x, star.y, star.z);
    galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
    galaxyGeometrySizes.push(star.size);
    STARS.push(star);
  }

  starsGeometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(galaxyGeometrySizes, 1)
  );
  starsGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(galaxyGeometryColors, 3)
  );
  starsGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(galaxyGeometryVertices, 3)
  );

  galaxyPoints = new THREE.Points(starsGeometry, StarsMaterial);

  const camera = new THREE.PerspectiveCamera(50, 1, 1, 10);
  camera.position.z = 2.5;
  camera.name = "camera";
  defaultScene.add(camera);
  defaultScene.add(new THREE.HemisphereLight(0xaaaaaa, 0x444444));
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(1, 1, 1);
  defaultScene.add(light);
}

function draw_Folder() {
  fillFolder();
  focusedFile = null;
  console.log("%cDraw folder", "color: red; font-size: 20px", folder);
  console.log("Draw folder", folder.value);
  folder.value.forEach((f, index) => {
    let scene;
    if (scenes[index]) {
      scene = scenes[index];
      const sceneElement = document.getElementById(`scene${index}`);
      // console.log(sceneElement)

      scene.userData.element = sceneElement;
      const sceneSize = scene.userData.size;
      sceneElement?.parentElement.addEventListener("mousemove", () => {
        !focusedFile
          ? onMouseMove(event, sceneSize, scene.getObjectByName("camera"))
          : "";
      });
      
    } else {
      scene = new THREE.Scene();
      scene.copy(defaultScene);
      const sceneElement = document.getElementById(`scene${index}`);
      const sceneSize = sceneElement.getBoundingClientRect();
      console.log(sceneElement);
      scene.userData.element = sceneElement;
      scene.userData.size = sceneSize;
      sceneElement.parentElement.addEventListener("mousemove", () => {
        !focusedFile
          ? onMouseMove(event, sceneSize, scene.getObjectByName("camera"))
          : "";
      });

      scenes.push(scene);
    }
    f.scene = scene;
    const obj = scene?.getObjectByName("toRotate");
    if (obj) {
        scene.remove(obj);
      }
    if (f.type != "fill") {
      scene.add(folderMesh(f));
    }
    // console.log(scene)
  });
}

function animate() {
  ID = requestAnimationFrame(animate);
  render();
}

function render() {
  // renderer.setClearColor( 0xffffff );
  // renderer.setScissorTest( false );
  // renderer.clear();
  let t = clock.getElapsedTime();
  // renderer.setClearColor( 0x000000 );
  // renderer.setScissorTest( true );
  if (focusedFile) {
    const scene = scenes[fileIndex];
    const obj = scene.getObjectByName("toRotate");
    obj.rotation.y = ((Math.cos(t / 4 + Math.PI / 2) * Math.PI) / 2) * 0.5;

    const rect = renderer.domElement.getBoundingClientRect();
    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;

    renderer.setViewport(0, 0, width, height);
    renderer.setScissor(0, 0, width, height);
    renderer.render(scene, cameraGlobal);

    let tempStarsArray = [];
    STARS.forEach((s) => {
      s.update();
      tempStarsArray.push(s.x, s.y, s.z);
    });
    starsGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(tempStarsArray, 3)
    );
  } else {
    scenes.forEach((s, index) => {
      const obj = s.getObjectByName("toRotate");
      if (obj) {
        // If obj is a group or a mesh
        if (obj.type === "Group") {
          obj.rotation.y =
            ((Math.cos(t / 4 + Math.PI / 2 + ((index / 4) * Math.PI) / 2) * Math.PI) /
              2) *
            0.75;
        } else if (obj.type === "Mesh") {
          obj.rotation.y =
            ((Math.cos(t / 4 + Math.PI / 2 + ((index / 4) * Math.PI) / 2) * Math.PI) /
              2) *
            0.5;
        }
        // s.children[0].rotation.y = Math.cos(t/4+Math.PI/2+(index/4)*Math.PI/2) * Math.PI/2 * 0.75;
        // s.children[0].rotation.y = -Math.cos(t) * Math.PI/2 * 0.75;
        const camera = s.getObjectByName("camera");
        const rect = s.userData.size;
        // set the viewport
        const width = rect.right - rect.left;
        const height = rect.bottom - rect.top;
        const left = rect.left;
        const bottom = renderer.domElement.clientHeight - rect.bottom;
        renderer.setViewport(left, bottom, width, height);
        renderer.setScissor(left, bottom, width, height);
        // camera.position.y = Math.cos( t + index ) *0.8  ;
        camera.lookAt(0, 0, 0);
        renderer.render(s, camera);
      }
    });
  }
}

function hover(f) {
  // console.log(f)
}

function onClick(f, i) {
  console.log("I HAVE CLICKED");
  if (!f.title || focusedFile) {
    console.log("BUT NOTHING");

    return;
  } // Set the focused file to the file that was clicked, if it the same, than close
  // focusedFile = focusedFile? null : f
  // document.getElementById("folderDisplay").style.display = "none";
  // folderDisplay.style.visibility = "hidden";
  // const element = f.scene.userData.element
  // element.parentElement.classList.toggle('hover:cursor-pointer')
  fileIndex = i;
  focusedFile = f;
  gotoFile(f);
}

function startLoading(f) {
  folderDisplay.style.visibility = "hidden";

  const scene = f?.scene;
  scene?.add(galaxyPoints);

  setTimeout(() => {
    endLoading(f);
  }, 1500);
}

function endLoading(f) {
  const scene = f?.scene;
  scene?.remove(galaxyPoints);
  POS_MAX = INITIAL_POS;
  // focusedFile = f.title=="Home"? null : f
  // document.getElementById("folderDisplay").style.display = "";
  folderDisplay.style.visibility = "visible";
    draw_Folder();
  focusedFile = null;
}

async function clickOnPath(f) {
  await openFile(f);
    draw_Folder();
}

onBeforeMount(() => {
  console.log("Before Mounted");
});

onMounted(() => {
    canvas = document.getElementById(`threecanvas`);
    folderDisplay = document.getElementById("folderDisplay");
  console.log("Mounted");
  console.log("Sub mounted", canvas, document.getElementById(`scene${0}`));
  init();
  animate();
  lookForPath()
  console.log('path',path.value[path.value.length - 1])
    openFile(path.value[path.value.length - 1])
    console.log(scenes)
});

onUnmounted(() => {
  cancelAnimationFrame(ID);
});
</script>

<style scoped>
.pathButton {
  @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform;
}
</style>
