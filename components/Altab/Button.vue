<template>
  <NuxtLink
    v-if="Type == 'link'"
    :to="Route"
    :class="`self-center transition-colors duration-300 ease-in transform rounded-xl hover:cursor-pointer px-2 h-12 text-center flex flex-col justify-center ${add_class}`"
  >
    {{ Title }}
  </NuxtLink>

  <button
    v-if="Type == 'button'"
    :class="`self-center transition-colors duration-300 ease-in transform rounded-xl hover:cursor-pointer px-2 h-12 ${add_class}`"
  >
    {{ Title }}
  </button>
</template>
<script>
export default {
  props: {
    Title: {
      type: String,
      default: "Button",
    },
    Color: {
      type: String,
      default: "black",
    },
    Size: {
      type: String,
      default: "small",
    },
    Type: {
      type: String,
      default: "button",
    },
    Route: {
      type: String,
      default: "",
    },
  },
  data() {
    if (this.Size == "small") {
      if (this.Color == "black") {
        return {
          add_class:
            "bg-black hover:bg-opacity-0 text-white hover:text-black border hover:border-black hover:scale-110",
        };
      } else if (this.Color == "transparent") {
        return {
          add_class:
            "bg-transparent hover:bg-black hover:text-white border border-black hover:border-white hover:scale-110",
        };
      }
    } else if (this.Size == "medium") {
      if (this.Color == "black") {
        return {
          add_class:
            "w-40 bg-black hover:bg-white text-white hover:text-black border hover:border-black hover:scale-105",
        };
      } else if (this.Color == "transparent") {
        return {
          add_class:
            "w-40 bg-transparent hover:bg-black hover:text-white border border-black hover:border-white hover:scale-105",
        };
      } else if (this.Color == "white") {
        return {
          add_class:
            "w-40 text-white bg-transparent hover:bg-white hover:text-black border border-black hover:border-white hover:scale-105",
        };
      }

    }
  },
};
</script>
<style></style>
