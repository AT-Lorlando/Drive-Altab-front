<template>
    <div class="flex flex-col items-center w-full h-full bg-black">
    
        <canvas id="threecanvas" ref="canvas" class="absolute w-screen h-screen inset-0 z-0"></canvas>
        <!-- TODO: Sparkles -->
        <div class="grid grid-cols-5 w-full overflow-y-auto pt-12 px-12"> 
            <div v-for="f in folders" v-show="!folder_focus || f.clicked" :key="f.id" class="h-80 w-auto z-10 hover:cursor-pointer" @click="onClick(f)">
                <h2 class="break-normal text-white text-center uppercase text-xl absolute w-80">{{f.title}}</h2>
                <div :id="`scene${f.id}`" @mouseover="hover(f)" class="w-80 h-80"/>
            </div>
        </div>

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
// Three js init 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import img from '../../assets/imgs/img.png';
console.log(img)
let renderer, controls, canvas, size, clock, cameraGlobal
const scenes = []

const mouse = new THREE.Vector2()

class Folder {
    constructor(id, title, password='') {
        this.id = id
        this.title = title
        this.password = password
        this.clicked = false
    }
}

const FOLDERS = [
    new Folder(1, 'folder 1', "azerty"),
    new Folder(2, 'folder 2'),
    new Folder(3, 'folder 3'),
    new Folder(4, 'folder 4'),
    new Folder(5, 'folder 5'),
    new Folder(6, 'folder 6'),
]

export default {
    data() {
        return {
            folders: FOLDERS,
            folder_focus: null,
            lockedModal: false,
        }
    },
    asyncData({isDev, route, store, env, params, query, req, res, redirect, error}) {
        
    },
    methods: {                              
        init() {
            // scene = new THREE.Scene()
            // camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            canvas = document.getElementById(`threecanvas`)
            size = canvas.getBoundingClientRect()
            renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true, alpha: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setClearColor( 0xffffff, 0 );
            renderer.setScissorTest( true );
            renderer.setSize( size.width, size.height );

            cameraGlobal = new THREE.PerspectiveCamera( 75, size.width / size.height, 0.1, 1000 );
            cameraGlobal.position.z = 2.5;


            clock = new THREE.Clock()

            const offset = 0.1
            const POS = [
                {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0},
                {x: 0, y: 0, z: -(1+2*offset), rx: 0, ry: Math.PI, rz: 0},
                {x: 0, y: 0.5+offset, z: -(0.5+offset), rx: Math.PI/2, ry: 0, rz: 0},
                {x: 0, y: -(0.5+offset), z: -(0.5+offset), rx: -Math.PI/2, ry: 0, rz: 0},
                {x: 0.5+offset, y: 0, z: -(0.5+offset), rx: 0, ry: Math.PI/2, rz: 0},
                {x: -(0.5+offset), y: 0, z: -(0.5+offset), rx: 0, ry: -Math.PI/2, rz: 0},]

            function onMouseMove( event, size, camera ) {
                mouse.x = ( event.clientX - size.x ) /  (size.width) - 0.5;
                mouse.y = ( event.clientY - size.y ) / (size.height) - 0.5;
                
                    camera.position.x += ( mouse.x*2 - camera.position.x )*0.05 ;
                    camera.position.y += ( - mouse.y*2- camera.position.y )*0.05 ;
                }

            const geometry = new THREE.PlaneGeometry( 1, 1 );
            const texture = new THREE.TextureLoader().load( img );
            const material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );
            FOLDERS.forEach(f => {
                const scene = new THREE.Scene()
                const sceneElement = document.getElementById( `scene${f.id}` );
                scene.userData.element = sceneElement;
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
            console.log(f)
        },
        onClick(f) {
            console.log(f)
            f.clicked = !f.clicked
            this.folder_focus = this.folder_focus? null : f

            // Change the class of the clicked element
            const element = document.getElementById( `scene${f.id}` );
            console.log(element.parentElement.classList)
            element.parentElement.classList.toggle('hover:cursor-pointer')

            // Show lockedModal if the folder is locked
            if(f.password) {
                this.lockedModal = true
            }
        },
        
    },
    mounted() {
        canvas = this.$refs.canvas
        this.init()
    }
}

</script>