<template>
    <div id="folderDisplay" class="grid grid-cols-5 w-full overflow-y-auto pt-12 px-12 bg-black"> 
        <div v-for="(file, index) in currentPage" v-show="!focusedFile || focusedFile === file" :key="index" class="h-80 w-auto z-10 hover:cursor-pointer" @click="onClick(file, index)">
            <h2 class="break-normal text-white text-center uppercase text-xl absolute w-80">{{file.title}}</h2>
            <div :id="`scene${index}`" @mouseover="hover(file)" class="w-80 h-80"/>
        </div>
    </div>
</template>

<script>
// Three js init 
import * as THREE from 'three';
import img from '../../assets/imgs/img.png';
let renderer, controls, canvas, size, clock, cameraGlobal
const scenes = []
const defaultScene = new THREE.Scene()
const mouse = new THREE.Vector2()
// Cube and plane parameters
const offset = 0.1
const POS = [
    {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0},
    {x: 0, y: 0, z: -(1+2*offset), rx: 0, ry: Math.PI, rz: 0},
    {x: 0, y: 0.5+offset, z: -(0.5+offset), rx: Math.PI/2, ry: 0, rz: 0},
    {x: 0, y: -(0.5+offset), z: -(0.5+offset), rx: -Math.PI/2, ry: 0, rz: 0},
    {x: 0.5+offset, y: 0, z: -(0.5+offset), rx: 0, ry: Math.PI/2, rz: 0},
    {x: -(0.5+offset), y: 0, z: -(0.5+offset), rx: 0, ry: -Math.PI/2, rz: 0},]
let geometryCube, geometryPlane, texture, material

// Stars parameters
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
let StarsMaterial, galaxyPoints, pixelRatio
const galaxyColors = [
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

function onMouseMove( event, size, camera ) {
    mouse.x = ( event.clientX - size.x ) /  (size.width) - 0.5;
    mouse.y = ( event.clientY - size.y ) / (size.height) - 0.5;
    
    camera.position.x += ( mouse.x*2 - camera.position.x )*0.05 ;
    camera.position.y += ( - mouse.y*2- camera.position.y )*0.05 ;
}

function folderMesh(f) {
    if(f.type === 'Folder') {
        // add 8 plane forming a cube
        const cube = new THREE.Group()    
        for ( let i = 0; i < 6; i ++ ) {
            const mesh = new THREE.Mesh( geometryCube, material );
            mesh.position.x = POS[i].x;
            mesh.position.y = POS[i].y;
            mesh.position.z = POS[i].z+0.5;

            mesh.rotation.x = POS[i].rx;
            mesh.rotation.y = POS[i].ry;
            mesh.rotation.z = POS[i].rz;
            cube.add( mesh );
        }
        cube.name = 'toRotate'
        return cube
    } else {
        // Add a plane facing the camera
        const new_texture = new THREE.TextureLoader().load( f.data );
        const new_material = new THREE.MeshBasicMaterial( { map: new_texture, side: THREE.DoubleSide } );
        const mesh = new THREE.Mesh( geometryPlane, new_material );
        mesh.position.x = 0;
        mesh.position.y = 0;
        mesh.position.z = 0;
        mesh.name = 'toRotate'
        return mesh
    }
}

export default {
    props: {
        currentPage: {
            type: Array[10],
            default: []
        },
        nextPage: {
            type: Array[10],
            default: []
        },
        previousPage: {
            type: Array[10],
            default: null
        },
        gotoFile: {
            type: Function,
            default: () => {}
        },

    },
    data() {
        return {
            // files: this.currentPage,
            focusedFile: null,
            fileIndex: null,
        }
    },
    methods: {
        init() {
            canvas = document.getElementById(`threecanvas`)
            size = canvas.getBoundingClientRect()
            clock = new THREE.Clock()
            renderer = new THREE.WebGLRenderer( {canvas: canvas, antialias: true, alpha: true } );
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setClearColor( 0xffffff, 0 );
            renderer.setScissorTest( true );
            renderer.setSize( size.width, size.height );

            pixelRatio = renderer.getPixelRatio()

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

            
            geometryCube = new THREE.PlaneGeometry( 1, 1 );
            geometryPlane = new THREE.PlaneGeometry( 1.6, 1.6 );
            texture = new THREE.TextureLoader().load( img );
            material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide } );

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

            galaxyPoints = new THREE.Points(starsGeometry, StarsMaterial);

            const camera = new THREE.PerspectiveCamera( 50, 1, 1, 10 );
            camera.position.z = 2.5;
            camera.name='camera'
            defaultScene.add(camera);
            defaultScene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444 ) );
            const light = new THREE.DirectionalLight( 0xffffff, 0.5 );
            light.position.set( 1, 1, 1 );
            defaultScene.add( light );
        },
        draw_Folder() {
            console.log("Draw folder", this.currentPage)
            this.currentPage.forEach((f, index) => {
                let scene
                if (scenes[index]) {
                    scene = scenes[index]
                    const obj = scene.getObjectByName( 'toRotate' );
                    const sceneElement = document.getElementById( `scene${index}` );
                    scene.userData.element = sceneElement;	
                    const sceneSize = scene.userData.size                    
                    sceneElement.parentElement.addEventListener( 'mousemove', 
                        () => { !this.focusedFile? onMouseMove(event, sceneSize, scene.getObjectByName( 'camera' )):""; } );
                    if (obj) {
                        scene.remove( obj );
                    }
                } else {
                    scene = new THREE.Scene();
                    scene.copy(defaultScene);
                    console.log(scene)
                    const sceneElement = document.getElementById( `scene${index}` );
                    const sceneSize = sceneElement.getBoundingClientRect()
                    scene.userData.element = sceneElement;
                    scene.userData.size = sceneSize;
                    sceneElement.parentElement.addEventListener( 'mousemove', 
                        () => { !this.focusedFile? onMouseMove(event, sceneSize, scene.getObjectByName( 'camera' )):pass; } );
                    
                    scenes.push( scene );
                }
                f.scene = scene
                scene.add( folderMesh(f) );
            })
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
            if(this.focusedFile) {
                const scene = scenes[this.fileIndex]
                const obj = scene.getObjectByName( 'toRotate' );	
                obj.rotation.y = Math.cos(t/4+Math.PI/2) * Math.PI/2 * 0.5;


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
            } else {
                scenes.forEach((s, index) => {
                    const element = s.userData.element;
                    // s.children[0].rotateOnAxis(new THREE.Vector3(0,1,0), 0.01);
                    const obj = s.getObjectByName( 'toRotate' );	
                    // If obj is a group or a mesh
                    if ( obj.type === 'Group') {
                        obj.rotation.y =  Math.cos(t/4+Math.PI/2+(index/4)*Math.PI/2) * Math.PI/2 * 0.75;
                    } else if ( obj.type === 'Mesh') {
                        obj.rotation.y =  Math.cos(t/4+Math.PI/2+(index/4)*Math.PI/2) * Math.PI/2 * 0.5;
                    }
                    // s.children[0].rotation.y = Math.cos(t/4+Math.PI/2+(index/4)*Math.PI/2) * Math.PI/2 * 0.75;
                    // s.children[0].rotation.y = -Math.cos(t) * Math.PI/2 * 0.75;
                    const camera = s.getObjectByName( 'camera' );
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
        onClick(f,i) {
            // Set the focused file to the file that was clicked, if it the same, than close
            this.focusedFile = this.focusedFile? null : f
            this.fileIndex = i
            document.getElementById("folderDisplay").style.display = "none";
            const element = f.scene.userData.element
            element.parentElement.classList.toggle('hover:cursor-pointer')

            this.gotoFile(f)
        },
        startLoading(f) {
            const scene = f.scene
            scene?.add(galaxyPoints);
        },
        endLoading(f) {
            this.focusedFile = null
            const scene = f.scene
            scene?.remove(galaxyPoints)
            POS_MAX = INITIAL_POS
            // this.focusedFile = f.title=="Home"? null : f
            document.getElementById("folderDisplay").style.display = "";
            this.draw_Folder()
        },
    },
    mounted() {
        canvas = this.$refs.canvas
        this.init()
        this.animate()
        
    },
}

</script>