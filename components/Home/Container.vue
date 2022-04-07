<template>
    <div class="flex flex-row w-full h-full bg-black">
    
        <canvas id="threecanvas" ref="canvas" class="top-0 left-0 absolute w-screen h-screen"></canvas>
        <div v-for="f in folders" :key="f.id">
            <h2 class="break-normal text-black text-center uppercase m-4">{{f.title}}</h2>
            <div :id="`scene${f.id}`" @mouseover="hover(f)" class="w-96 h-96 border-2 border-red-300">
            </div>
        </div>

    </div>
</template>

<script>
// Three js init 
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let renderer, controls, canvas, size
const scenes = []


class Folder {
    constructor(id, title) {
        this.id = id
        this.title = title
        this.password = ''
    }
}

const FOLDERS = [
    new Folder(1, 'folder 1'),
    new Folder(2, 'folder 2'),
    new Folder(3, 'folder 3'),
    new Folder(4, 'folder 4'),
]

export default {
    data() {
        return {
            folders: [
                new Folder(1, 'folder 1'),
                new Folder(2, 'folder 2'),
                new Folder(3, 'folder 3'),
                new Folder(4, 'folder 4'),
            ],
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
            // renderer.setClearColor( 0xffffff, 0 );
            // renderer.setScissorTest( true );
            // renderer.toneMappingExposure = 64

            FOLDERS.forEach(f => {
                const scene = new THREE.Scene()
                const sceneElement = document.getElementById( `scene${f.id}` );
                scene.userData.element = sceneElement;
                const sceneSize = sceneElement.getBoundingClientRect()

                // const camera = new THREE.PerspectiveCamera( 50,1, 1, 1000 );
                const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
                camera.position.z = 2;
                scene.userData.camera = camera;

                const controls = new OrbitControls( scene.userData.camera, scene.userData.element );
                controls.minDistance = 2;
                controls.maxDistance = 5;
                controls.enablePan = false;
                controls.enableZoom = false;
                scene.userData.controls = controls;

                // add one random mesh to each scene
                const geometry = new THREE.BoxGeometry( 1, 1, 1 );

                const material = new THREE.MeshStandardMaterial( {

                    color: new THREE.Color().setHSL( Math.random(), 1, 0.75 ),
                    roughness: 0.5,
                    metalness: 0,
                    flatShading: true

                } );

                scene.add( new THREE.Mesh( geometry, material ) );

                scene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );

                const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
                light.position.set( 1, 1, 1 );
                scene.add( light );
                scenes.push( scene );

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

            // renderer.setClearColor( 0x000000 );
            // renderer.setScissorTest( true );
            scenes.forEach(s => {
                const element = s.userData.element;
                const rect = element.getBoundingClientRect();
                // set the viewport
                const width = rect.right - rect.left;
                const height = rect.bottom - rect.top;
                const left = rect.left;
                const bottom = renderer.domElement.clientHeight - rect.bottom;

                renderer.setViewport( left, bottom, width, height );
                renderer.setScissor( left, bottom, width, height );

                const camera = s.userData.camera;
                camera.lookAt( 0,0,0 );
                renderer.render( s, camera );
            })
        },
        hover(f) {
            console.log(f)
        }
    },
    mounted() {
        canvas = this.$refs.canvas
        this.init()
    }
}

</script>