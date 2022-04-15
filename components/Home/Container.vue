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
let APIurl = 'https://pixabay.com/api/?key=5832566-81dc7429a63c86e3b707d0429&q={SEARCH}&per_page=10&page=1'

export default {
    data() {
        return {
            path: [{id: 0, title: "Home", password: "", type: "Folder"}],
            folder: [],
            lockedModal: false,
            photoModal: false,
            photo: {},
        };
    },
    methods: {
        gotoFile(f) {
            this.path.push(f)
            if (f.password != "") {
                this.lockedModal = true               
            }
            this.openFile(f)
        },
        async openFile(f) {
            this.lockedModal = false
            this.photoModal = false
            console.log("Open", f)
            this.path = this.path.slice(0, this.path.indexOf(f)+1)
            if (f.type == "Folder") {
                this.$refs.Scene.startLoading(f);
                await this.fetch_folder(f.title).then(res => {
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
            console.log("Fetch folder", url)
            if (url == "Home") {
                this.folder = [
                    {id: 1, title: "Blue", type: "Folder",password: "Azerty"},
                    {id: 2, title: "Red", type: "Folder",password: ""},
                    {id: 3, title: "Green", type: "Folder",password: ""},
                    {id: 4, title: "Purple", type: "Folder",password: ""},
                    {id: 5, title: "Orange", type: "Folder",password: ""},
                    {id: 6, title: "Pink", type: "Folder",password: ""},
                    {id: 7, title: "Black", type: "Folder",password: ""},
                    {id: 8, title: "White", type: "Folder",password: ""},
                    {id: 9, title: "Cyan", type: "Folder",password: ""},
                    {id: 10, title: "Yellow", type: "Folder",password: ""},
                ]
            } else {
                // Fetch with axios
                await axios.get(APIurl.replace('{SEARCH}', url)).then(res => {
                    console.log(res.data)
                    this.folder = res.data.hits.map(e => {return {
                        id: e.id,
                        title:e.tags,
                        data: e.largeImageURL,
                        width: e.imageWidth,
                        height: e.imageHeight,
                        date: '04/12/2000',
                        size: 420,
                        type: "image"}});
                });
            }
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
    },
    mounted() {
        console.log('Fetching home...')
        this.fetch_folder('Home').then(() => {
            this.$refs.Scene.draw_Folder();
        })
        
    },

}

</script>

<style scoped>
.pathButton
{
    @apply hover:bg-white hover:bg-opacity-10 hover:cursor-pointer rounded-xl py-2 transition-colors duration-150 ease-in transform
}

</style>