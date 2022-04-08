<template>
    <button 
        :class="`transition-colors duration-300 ease-in transform hover:scale-110 w-20 rounded-xl hover:cursor-pointer px-2 h-12 ${add_class}`">

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
        }
    },
    data() {
        if (this.Color == 'black') {
            return {
                add_class: 'bg-black hover:bg-opacity-0 text-white hover:text-black border hover:border-black'
            }
        } else if (this.Color == 'transparent') {
            return {
                add_class: 'bg-transparent hover:bg-black hover:text-white border border-black hover:border-white'
            }
        }
    },
}
</script>
<style>
    
</style>