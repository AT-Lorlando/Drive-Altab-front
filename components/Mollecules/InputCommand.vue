<template>
    <div class="flex flex-row justify-center text-white items-center py-2 px-3 rounded-2xl border-2 border-white space-x-2">
        <IconsSearch class="w-8 h-8" />
        <form @submit.prevent="search">
            <input class="w-96 bg-transparent pl-2" type="text" placeholder="Search a folder/file"/>
        </form>
        <p>(Ctrl+K)</p>
    </div>
</template>

<script>
export default {
    methods: {
        search (e) {
                this.$router.push(e.target[0].value)
            }
        }
    }

</script>