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
        <ModalLocked v-if="lockedModal" :close="closeModal" :confirm="confirmModal" :title="'Test'"/>

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
        };
    },
    methods: {
        gotoFile(f) {
            this.path.push(f)
            if (f.password != "") {
                this.lockedModal = true               
            } else {
                this.openFile(f)
            }
        },
        async openFile(f) {
            this.$refs.Scene.startLoading(f);
            console.log("Open", f)
            this.lockedModal = false
            this.path = this.path.slice(0, this.path.indexOf(f)+1)
            if (f.type == "Folder") {
                await this.fetch_folder(f.title).then(res => {
                        setTimeout(() => {
                            this.$refs.Scene.endLoading(f);
                        }, 1000);
                    })
            } else if (f.type == "image") {
                pass
            }
        },
        async fetch_img(url) {
            const IMGS_TAB = [];
            for (let i = 1; i < 2; i++) {
                await axios.get(url.replace("page=1", `page=${i}`)).then(res => {
                    // console.log(res.data)
                    const imgs = res.data.hits.map(e => new Image(e.id, e.tags, e.largeImageURL));
                    console.log(...imgs);
                    IMGS_TAB.push(...imgs);
                });
            }
            return IMGS_TAB;
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
                    this.folder = res.data.hits.map(e => {return {id: e.id,title: e.tags,data: e.largeImageURL, type: "image"}});
                });
            }
        }
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