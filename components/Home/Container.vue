<template>
    <div class="flex flex-col items-center w-full h-full bg-black">
        <canvas id="threecanvas" ref="canvas" class="absolute w-screen h-screen inset-0 z-0"></canvas>
        <div class="pl-12 w-full text-white text-4xl z-10">
            <button v-for="f in path" class="pathButton" @click="gotoFile(f)">
                {{`/`+f.title}}
            </button>
        </div>
        <!-- TODO: Sparkles -->
        <SubContainer :currentPage="folder" :nextPage="folder" ref="Scene" :gotoFile="gotoFile"/>

        <!-- Modal to ask the password -->
        <ModalLocked v-if="lockedModal" :close="() => {this.lockedModal == false}" :confirm="confirmModal" :title="'Test'"/>

        <!-- Modal if the photo is focus -->
        <ModalPhoto v-if="photoModal" 
            :close="closeModal" 
            :photo="photo"
            :next="nextPhoto"
            :previous="previousPhoto"
            ref="Photo"
            />

    </div>
</template>

<script>
// Import axios
import axios from 'axios'
let APIurl = 'http://127.0.0.1:3333/api'

export default {
    props : {
        searchedPath : {
            type: Array,
            default: []
        },
    },
    data() {
        return {
            path: [],
            folder: [],
            lockedModal: false,
            photoModal: false,
            photo: {},
        };
    },
    methods: {
        gotoFile(f) {
            if(f.title != "Home") {
                this.path.push(f)
            }
            if (f.password != "") {
                this.lockedModal = true               
            }
            this.openFile(f)
        },
        async openFile(f) {
            this.lockedModal = false
            this.photoModal = false
            console.log("Open", f)
            if(this.path.length > 1) {
                this.path = this.path.slice(0, this.path.lastIndexOf(f)+1)
            } else {
                this.path = [{id: 1, title: "Home", password: "", type: "Folder"}]
            }
            if (f.type == "Folder") {
                this.$refs.Scene.startLoading(f);
                await this.fetch_folder(`/folders/${f.id}`).then(res => {
                        setTimeout(() => {
                            this.$refs.Scene.endLoading(f);
                        }, 1000);
                    })
            } else if (f.type == "image") {
                this.photo = f
                this.photoModal = true
            }
        },
        async fetch_folder(url) {
            console.log("Fetch folder", APIurl+url)
            await axios.get(APIurl+url).then(res => {
                console.log(res.data)
                 if (res.data.images.data.length > 0 ) { // We have images
                    const data = res.data.images.data
                    this.folder = data.map(e => {return {
                        id: e.id,
                        title: e.title,
                        data: APIurl.replace('/api','')+e.data.url,
                        width: 'e.imageWidth',
                        height: 'e.imageHeight',
                        date: '04/12/2000',
                        size: 420,
                        type: "image"
                    }});
                } else { // We have subfolders
                    const data = res.data.childs
                    this.folder = data?.map(f => {
                        return {
                            id: f.id,
                            title: f.name,
                            type: "Folder",
                            password: "",
                        }
                    })
                    // TODO: Covering the cube with images
                    while(this.folder.length < 10) {
                        this.folder.push({
                            id: 0,
                            title: "",
                            data: "",
                            width: 0,
                            height: 0,
                            date: "",
                            size: 0,
                            type: "fill"
                        })
                    }
                }
            });
        },
        closeModal(s) {
            this.$refs.Scene.focusedFile = null;
            this.$refs.Scene.folderDisplay.style.visibility = "visible";
            if (s == "locked") {
                this.lockedModal = false
            } else if (s == 'photo') {
                this.photoModal = false
                this.path.pop()
            }
        },
        nextPhoto() {
            this.path.pop()
            let f = this.folder[(this.folder.indexOf(this.photo)+1)%this.folder.length]
            this.$refs.Scene.focusedFile = f
            this.$refs.Scene.fileIndex = this.folder.indexOf(f)
            this.photo = f
            this.gotoFile(f)
            this.$refs.Photo.setPhoto(f)
        },
        previousPhoto() {
            this.path.pop()
            let f = this.folder[(this.folder.indexOf(this.photo)-1+this.folder.length)%this.folder.length]
            this.$refs.Scene.focusedFile = f
            this.$refs.Scene.fileIndex = this.folder.indexOf(f)
            this.photo = f
            this.gotoFile(f)
            this.$refs.Photo.setPhoto(f)
        },
        async lookForPath() {
            let searchedFile = this.searchedPath[this.searchedPath.length-1]
            if(searchedFile && searchedFile?.id != 1) {
                axios.get(APIurl+'/folders').then(res => {
                    let folder = res.data.find(f => f.name.toLowerCase() == searchedFile.toLowerCase())
                    if(folder) {
                        this.path = [{id: folder.id, title: folder.name, password: "", type: "Folder",}]
                        console.log("Draw ", folder)
                        this.fetch_folder(`/folders/${this.path[0].id}`).then(() => {
                            this.$refs.Scene.draw_Folder();
                        })   
                    }            
                })
            } else {
                console.log("No path to look for")
                console.log("Draw home")
                this.path = [{id: 1, title: "Home", password: "", type: "Folder"}]
                this.fetch_folder(`/folders/${this.path[0].id}`).then(() => {
                    this.$refs.Scene.draw_Folder();
                })   
            }
        },
    },
    mounted() {
        console.log('Mounted')
        this.lookForPath()        
    },

}

</script>

<style scoped>
.pathButton
{
    @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform
}

</style>