<template>
    <div class="absolute mt-20 z-20 w-full h-4/6 flex flex-row text-white justify-between items-center">
        <div class="w-1/3 h-full p-4">
            <h1 class="text-3xl">Informations sur la photo</h1>
            <div class="flex flex-col space-y-1 m-4">
                <div v-for="i in informations" class="flex flex-row w-1/2 justify-between">
                    <p class="text-xl text-center pb-1">{{i.name}}:</p>
                    <p class="text-xl text-center pb-1">{{i.value}}</p>
                </div>
            </div>
        </div>

        <div class="flex flex-row w-1/3 justify-between px-4 h-full">
            <button class="bg-transparent" @click="previous">
                <IconsAdd class="w-20 h-20" />
            </button>
            <button class="bg-transparent w-full h-full hover:cursor-pointer" @click="fullscreen">
            </button>
            <button class="bg-transparent" @click="next">
                <IconsAdd class="w-20 h-20" />
            </button>
        </div>
        <div class="w-1/3 h-auto px-4 pl-20 space-y-8 my-auto flex flex-col">
                <AltabButton @click="download" class="w-80" Title="Télécharger" Color="black" Size="medium"/>
                <AltabButton @click="close" class="w-80" Title="Demander une retouche" Color="black" Size="medium"/>
                <AltabButton @click="close" class="w-80" Title="Demander de l'aide" Color="black" Size="medium"/>
                <AltabButton @click="close('photo')" class="w-80" Title="Fermer" Color="black" Size="medium"/>
        </div>
    </div>
</template>

<script>
export default {
     props: {
        title: {
            type: String,
            default: 'File'
        },
        close: {
            type: Function,
            default: () => {
                console.log("test")
            }
        },
        confirm : {
            type: Function,
            default: () => {}
        },
        photo : {
            type: Object,
            default: {}
        }
    },
    data() {
        return {
            informations: [{
                name: 'Taille',
                value: this.photo.size
            }, {
                name: 'Type',
                value: this.photo.type
            }, {
                name: 'Dimensions',
                value: this.photo.width + 'x' + this.photo.height
            }, {
                name: 'Nom',
                value: this.photo.title
            }, {
                name: 'Date',
                value: this.photo.date
            }],
            fullSize: null,
        }
    },
    methods: {
        download() {
            console.log('download');
            // Fetch the photo in its original size if it's not already done, then download it
            this.fetchPhoto()
        },
        askRetouch() {
            console.log('Retouche');
        },
        askHelp() {
            console.log('Help');
        },
        fullscreen() {
            console.log('fullscreen');
            // Fetch the photo in its original size if it's not already done, then display it in fullscreen
            this.fetchPhoto()
            
        },
        fetchPhoto() {
            if (this.fullSize == null) {
                console.log('Fetch photo', this.photo.id, 'in fullsize');
            }
            this.fullSize = this.photo.url;
        },
    },
}
</script>