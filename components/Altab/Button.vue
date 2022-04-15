<template>
    <button 
        :class="`transition-colors duration-300 ease-in transform  w-20 rounded-xl hover:cursor-pointer px-2 h-12 ${add_class}`">

        {{Title}}
    </button>
</template>
<script>
export default {
    props: {
        Title: {
            type: String,
            default: 'Button'
        },
        Color: {
            type: String,
            default: 'black'
        },
        Size: {
            type: String,
            default: 'small'
        },
    },
    data() {
        if( this.Size == "small") {
            if (this.Color == 'black') {
                return {
                    add_class: 'bg-black hover:bg-opacity-0 text-white hover:text-black border hover:border-black hover:scale-110'
                }
            } else if (this.Color == 'transparent') {
                return {
                    add_class: 'bg-transparent hover:bg-black hover:text-white border border-black hover:border-white hover:scale-110'
                }
            }
        } else if (this.Size=="medium") {
            if (this.Color == 'black') {
            return {
                add_class: 'bg-black hover:bg-white text-white hover:text-black border hover:border-black hover:scale-105'
            }
        } else if (this.Color == 'transparent') {
            return {
                add_class: 'bg-transparent hover:bg-black hover:text-white border border-black hover:border-white hover:scale-10'
            }
        }

        }
    },
}
</script>
<style>
    
</style>