<template>
    <div class="flex flex-col items-center w-full h-full bg-black">
        <canvas id="threecanvas" ref="canvas" class="absolute w-screen h-screen inset-0 z-0"></canvas>
        <div class="pl-12 w-full text-white text-4xl z-10">
            <button v-for="f in path" class="pathButton" @click="goto(f)">
                {{`/`+f.title}}
            </button>
        </div>
        <!-- TODO: Sparkles -->
        <div id="folderDisplay" class="grid grid-cols-5 w-full overflow-y-auto pt-12 px-12"> 
            <div v-for="f in folders" v-show="!folder_focus || f.clicked" :key="f.id" class="h-80 w-auto z-10 hover:cursor-pointer" @click="onClick(f)">
                <h2 class="break-normal text-white text-center uppercase text-xl absolute w-80">{{f.title}}</h2>
                <div v-if="f.constructor.name === 'Folder'" :id="`scene${f.id}`" @mouseover="hover(f)" class="w-80 h-80"/>
            </div>
        </div>

        <!-- Modal to ask the password -->
        <div v-if="lockedModal" class="absolute mt-56 z-20 w-80 h-80 bg-white flex flex-col rounded-xl border-2 border-white py-2 bg-opacity-75 justify-between">
            <div class="flex flex-row justify-between items-center border-b-2 border-black px-4 pb-1">
                <h2 class="text-2xl text-center uppercase">{{folder_focus.title}}</h2>
                <div class="flex flex-row items-center">
                    <IconsExit class="w-10 h-10 hover:cursor-pointer" @click="lockedModal = false"/>
                </div>
            </div>
            <div class="px-2">
                <h2 class="text-black text-xl text-center pb-1">This folder is locked</h2>
                <div class="flex flex-row justify-center items-center">
                    <input type="password" v-model="password" class="w-full h-12 p-2 border-2 rounded-xl border-black text-black text-center" placeholder="Password"/>
                </div>
                <a class="pl-2 underline text-blue-600 hover:cursor-pointer hover:text-blue-800">How can i get the password</a>
            </div>
            <div class="w-full">
                <div class="flex flex-row w-full justify-between px-2">                    
                    <AltabButton @click="onClick(lockedModal)" Title="Cancel" Color="black"/>
                    <AltabButton @click="onClick(lockedModal)" Title="Confirm" Color="transparent"/>
                </div>
            </div>
        </div>

        

    </div>
</template>

<script>
// Import axios
import axios from 'axios'
let url = 'https://pixabay.com/api/?key=5832566-81dc7429a63c86e3b707d0429&q={SEARCH}&per_page=25&page=1'
// Three js init 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import img from '../../assets/imgs/img.png';
let renderer, controls, canvas, size, clock, cameraGlobal
const scenes = []

const mouse = new THREE.Vector2()

class Folder {
    constructor(id, title, password='') {
        this.id = id
        this.title = title
        this.password = password
        this.clicked = false
        this.scene = new THREE.Scene()
        this.folders = [] // tab ID of childs folders 
        this.images = [] // tab ID of childs images
        this.cover = [] // tab of images covering the folder
        this.request = url.replace('{SEARCH}', title)
    }
}

class Image {
    constructor(id, title) {
        this.id = id
        this.title = title
        this.clicked = false
        this.images = [] // tab ID of childs images
        this.cover = [] // tab of images covering the folder
    }
}
// Star class to three js load

const amount = 250
const STARS = [];
const galaxyGeometryVertices = [];
const galaxyGeometryColors = [];
const galaxyGeometrySizes = [];
const starsGeometry = new THREE.BufferGeometry();
const hue = 215/360
let INITIAL_POS = -1
// let POS_MAX = INITIAL_POS
let POS_MAX = 1
let StarsMaterial 
let pixelRatio
// let text 


let galaxyColors = [
  new THREE.Color().setHSL(hue,1,0.99),
  new THREE.Color().setHSL(hue,1,0.95),
  new THREE.Color().setHSL(hue,1,0.8),
  new THREE.Color().setHSL(hue,1,0.7),
  new THREE.Color().setHSL(hue,1,0.6)
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
}`

const fragmentshader = `
uniform sampler2D pointTexture;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
}`

class Star {
  setup(color) {
    this.y = -1.25 + ((Math.random() - 0.5) / 6);
    this.x = INITIAL_POS + Math.abs((this.y/-1.25)-1);
    this.z = -1;
    this.v = (Math.random() / 0.5) * 0.1+0.01,
    this.initial_x = this.x;
    this.max_x = POS_MAX - Math.abs((this.y/-1.25)-1);
    
    this.size = Math.random() * 0.01 + 0.5 * pixelRatio;
    this.color = color;
  }
  update() {
    this.x += this.v/5
    if (this.x > this.max_x) {
      this.x = this.initial_x;
    //   this.x -= 2;
    }
  }
}

// TEMPORARY DEF

const FOLDERS = [
    new Folder(1, 'Yellow', "azerty"),
    new Folder(2, 'Flower'),
    new Folder(3, 'Cat'),
    new Folder(4, 'Horse'),
    new Folder(5, 'Car'),
    new Folder(6, 'Paris'),
    new Image(7, 'Yellow'),

]

export default {
    data() {
        return {
            path: [new Folder(0, 'Home')], // Path to travel between folder
            folders: FOLDERS, // Folder actually displayed in the current folder
            folder_focus: null, // Folder focus before entering
            lockedModal: false, // Modal to unlock folder
            loadingModal: false, // Modal to show loading state
        }
    },
    asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
        
        },
    methods: {                              
        init() {
            canvas = document.getElementById(`threecanvas`)
            size = canvas.getBoundingClientRect()
            clock = new THREE.Clock()
            renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true, alpha: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            pixelRatio = renderer.getPixelRatio()
            renderer.setClearColor( 0xffffff, 0 );
            renderer.setScissorTest( true );
            renderer.setSize( size.width, size.height );

            cameraGlobal = new THREE.PerspectiveCamera( 75, size.width / size.height, 0.1, 1000 );
            cameraGlobal.position.z = 2.5;

            StarsMaterial = new THREE.ShaderMaterial({
                uniforms: {
                    pointTexture: {
                    value: new THREE.TextureLoader().load(
                        "../../assets/imgs/dotTexture.png"
                    )
                    }
                },
                vertexShader: vertexshader,
                fragmentShader: fragmentshader,
                blending: THREE.AdditiveBlending,
                alphaTest: 1.0,
                transparent: true
                });

            for (let i = 0; i < amount; i++) {
                let star = new Star()
                star.setup(galaxyColors[Math.floor(Math.random() * galaxyColors.length)])
                galaxyGeometryVertices.push(star.x, star.y, star.z);
                galaxyGeometryColors.push(star.color.r, star.color.g, star.color.b);
                galaxyGeometrySizes.push(star.size);
                STARS.push(star)
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

            // A 'loading' text
            // let loader = new FontLoader
            // loader.load( '../../assets/fonts/helvetiker_regular.typeface.json', function ( font ) {
            //     let textGeo = new TextGeometry( 'Loading...', {
            //         font: font,
            //         size: 0.05,
            //         height: 0.1,
            //         curveSegments: 12,
            //         bevelEnabled: false
            //     });
            //     let textMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff } );
            //     text = new THREE.Mesh( textGeo, textMaterial );
            //     textGeo.computeBoundingBox();
            //     text.position.x = -textGeo.boundingBox.max.x / 2;
            //     text.position.y = -0.9;
            //     text.position.z = 0;
            //     text.rotation.x = 0;
            //     text.rotation.y = 0;
            //     text.rotation.z = 0;
            //     text.scale.x = 1;
            //     text.scale.y = 1;
            //     text.scale.z = 1;
            //     console.log(text)
            //     text.lookAt(cameraGlobal.position);
            //     // text.visible = false;
            // });



            // Plane position to form a cube
            const offset = 0.1
            const POS = [
                {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0},
                {x: 0, y: 0, z: -(1+2*offset), rx: 0, ry: Math.PI, rz: 0},
                {x: 0, y: 0.5+offset, z: -(0.5+offset), rx: Math.PI/2, ry: 0, rz: 0},
                {x: 0, y: -(0.5+offset), z: -(0.5+offset), rx: -Math.PI/2, ry: 0, rz: 0},
                {x: 0.5+offset, y: 0, z: -(0.5+offset), rx: 0, ry: Math.PI/2, rz: 0},
                {x: -(0.5+offset), y: 0, z: -(0.5+offset), rx: 0, ry: -Math.PI/2, rz: 0},]

            

            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const texture = new THREE.TextureLoader().load( img );
            const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );

            FOLDERS.forEach(f => {
                console.log(f)
                if(f.constructor.name != 'Folder') {
                    return
                }
                const scene = new THREE.Scene()
                const sceneElement = document.getElementById( `scene${f.id}` );
                scene.userData.element = sceneElement;
                scene.userData.folder = f;
                f.scene = scene
                const sceneSize = sceneElement.getBoundingClientRect()



                // const camera = new THREE.PerspectiveCamera( 50,1, 1, 1000 );
                const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
                camera.position.z = 2.5;
                scene.userData.camera = camera;

                // const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
                // controls.enablePan = false;
                // controls.enableZoom = false;
                // controls.enableRotate = false;
                // scene.userData.controls = controls;

                // add 8 plane forming a cube
                const cube = new THREE.Group()
                

                for ( let i = 0; i < 6; i ++ ) {
                    const mesh = new THREE.Mesh( geometry, material );
                    mesh.position.x = POS[i].x;
                    mesh.position.y = POS[i].y;
                    mesh.position.z = POS[i].z+0.5;

                    mesh.rotation.x = POS[i].rx;
                    mesh.rotation.y = POS[i].ry;
                    mesh.rotation.z = POS[i].rz;
                    cube.add( mesh );
                }
                scene.add( cube );

                // Add sparkles                
                


                // scene.add( new THREE.Mesh( geometry, material ) );

                scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );

                const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
                light.position.set( 1, 1, 1 );
                scene.add( light );
                scenes.push( scene );
                sceneElement.parentElement.addEventListener( 'mousemove', 
                    () => { !this.folder_focus? onMouseMove(event, sceneSize, camera):""; } );

                console.log(scene)

            })
            
            function onMouseMove( event, size, camera ) {
                mouse.x = ( event.clientX - size.x ) /  (size.width) - 0.5;
                mouse.y = ( event.clientY - size.y ) / (size.height) - 0.5;
                
                    camera.position.x += ( mouse.x*2 - camera.position.x )*0.05 ;
                    camera.position.y += ( - mouse.y*2- camera.position.y )*0.05 ;
                }

            this.animate()
        },
        animate() {
            requestAnimationFrame(this.animate)
            this.render()
        },
        render() {
            // renderer.setClearColor( 0xffffff );
            // renderer.setScissorTest( false );
            // renderer.clear();
            let t = clock.getElapsedTime()
            // renderer.setClearColor( 0x000000 );
            // renderer.setScissorTest( true );
            if(this.folder_focus) {
                const scene = scenes[this.folder_focus.id-1]
                scene.children[0].rotation.y = Math.cos(t/4+Math.PI/2) * Math.PI/2 * 0.75;


                const rect = renderer.domElement.getBoundingClientRect()
                const width = rect.right - rect.left;
                const height = rect.bottom - rect.top;
                
                renderer.setViewport( 0, 0, width, height );
                renderer.setScissor( 0, 0, width, height );
                renderer.render( scene, cameraGlobal );

                let tempStarsArray = [];
                STARS.forEach(s => {
                    s.update();
                    tempStarsArray.push(s.x, s.y, s.z);
                    
                });
                starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(tempStarsArray, 3));

                // const element = scene.userData.element;
                // const rect = element.getBoundingClientRect();
                // // set the viewport
                // const width = rect.right - rect.left;
                // const height = rect.bottom - rect.top;
                // const left = rect.left;
                // const bottom = renderer.domElement.clientHeight - rect.bottom;
                // renderer.setViewport( left, bottom, width, height );
                // renderer.setScissor( left, bottom, width, height );   
                // const camera = scene.userData.camera;
                // renderer.render( scene, camera );


                // camera.position.y = Math.cos( t + index ) *0.8  ;

            } else {
                scenes.forEach((s, index) => {
                    const element = s.userData.element;
                    // s.children[0].rotateOnAxis(new THREE.Vector3(0,1,0), 0.01);
                    s.children[0].rotation.y = Math.cos(t/4+Math.PI/2+(index/4)*Math.PI/2) * Math.PI/2 * 0.75;
                    // s.children[0].rotation.y = -Math.cos(t) * Math.PI/2 * 0.75;
                    const camera = s.userData.camera;
                    const rect = element.getBoundingClientRect();   
                    // set the viewport
                    const width = rect.right - rect.left;
                    const height = rect.bottom - rect.top;
                    const left = rect.left;
                    const bottom = renderer.domElement.clientHeight - rect.bottom;
                    renderer.setViewport( left, bottom, width, height );
                    renderer.setScissor( left, bottom, width, height );
                    // camera.position.y = Math.cos( t + index ) *0.8  ;
                    camera.lookAt( 0,0,0 );
                    renderer.render( s, camera );
                })
            }            
        },
        hover(f) {
            // console.log(f)
        },
        onClick(f) {
            console.log(f)
            f.clicked = !f.clicked
            this.folder_focus = this.folder_focus? null : f

            this.path.push(f)

            document.getElementById("folderDisplay").style.display = "none";

            // Change the class of the clicked element
            const element = document.getElementById( `scene${f.id}` );
            console.log(element.parentElement.classList)
            element.parentElement.classList.toggle('hover:cursor-pointer')

            // Show lockedModal if the folder is locked
            if(f.password) {
                this.lockedModal = true
            } else {
                this.goto(f)
            }
        },
        goto(f) {
            
            // Fetch api with axios

            if(f != this.folder_focus) {
                this.lockedModal = false
                this.folder_focus = f.title=="Home"? null : f
            }

            this.folders.forEach(e => {
                if(e!=f) {
                    e.clicked = false
                }
            })

            this.path = this.path.slice(0, this.path.indexOf(f)+1)

            // Add the loading animation to the scene
            const scene = f.scene
            console.log(scene)

            //adding bunch of stars
            const galaxyPoints = new THREE.Points(starsGeometry, StarsMaterial);
            scene.add(galaxyPoints);
            
            if(f.title!="Home") {
                const url = f.request
    
                this.fetch_img(url).then(res => {
                    
                    console.log(res)
                    document.getElementById("folderDisplay").style.display = "";
                    scene.remove(galaxyPoints)
                    POS_MAX = INITIAL_POS
                })
            }

            

        },
        async fetch_img(url) {
            const IMGS_TAB = []
            for (let i = 1; i < 10; i++) {
                await axios.get(url.replace('page=1',`page=${i}`)).then(res => {
                    console.log(res.data)
                    const imgs = res.data.hits.map(e => e.largeImageURL)
                    IMGS_TAB.push(...imgs)
                })
            }
            return IMGS_TAB
        }
        
    },
    mounted() {
        canvas = this.$refs.canvas
        this.init()
    }
}

</script>

<style scoped>
.pathButton
{
    @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform
}

</style>