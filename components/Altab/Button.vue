<template>
  <NuxtLink
    v-if="Type == 'link'"
    :to="Route"
    :class="`self-center transition-colors duration-300 ease-in transform rounded-xl hover:cursor-pointer xl:px-2 h-12 text-center flex flex-col justify-center ${add_class}`"
  >
    {{ Title }}
  </NuxtLink>
  <div v-else-if="Type=='bilink'" class="self-center flex flex-row">
    <NuxtLink
      :to="Route"
      :class="`self-center transition-colors duration-300 ease-in transform rounded-l-xl hover:cursor-pointer xl:px-2 h-12 text-center flex flex-col justify-center ${add_class}`"
    >
      {{ Title }}
    </NuxtLink>
    <NuxtLink
      :to="biRoute"
      :class="`self-center transition-colors duration-300 ease-in transform rounded-r-xl hover:cursor-pointer xl:px-2 h-12 text-center flex flex-col justify-center ${add_class}`"
    >
      {{ biTitle }}
    </NuxtLink>
  </div>

  <button
    v-else-if="Type == 'button'"
    :class="`self-center transition-colors duration-300 ease-in transform rounded-xl hover:cursor-pointer xl:px-2 h-12 ${add_class}`"
    @click="click"
  >
    {{ Title }}
  </button>
  <div v-else-if="Type=='bibutton'" class="self-center flex flex-row">
    <button 
      :class="`self-center transition-colors duration-300 ease-in transform rounded-l-xl hover:cursor-pointer xl:px-2 h-12 ${add_class}`"
      @click="click"
    >
    {{ Title }}
    </button>
    <button
      :class="`self-center transition-colors duration-300 ease-in transform rounded-r-xl hover:cursor-pointer xl:px-2 h-12 ${add_class}`"
      @click="biclick"
    >
    {{ biTitle }}
    </button>
  </div>
</template>
<script>
export default {
  props: {
    Title: {
      type: String,
      default: "Button",
    },
    biTitle: {
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
    biRoute: {
      type: String,
      default: "",
    },
    click : {
      type: Function,
      default: () => {},
    },
    biclick : {
      type: Function,
      default: () => {},
    },
  },
  data() {
    let add_class = "";
    if (this.Size == "small") {
      if (this.Type == 'bibutton' || this.Type == 'bilink') {
        add_class += "w-15 "
      } else {
        add_class += "w-32 "
      }
      if (this.Color == "black") {
          add_class+=
            "bg-primary-dark hover:bg-opacity-0 text-white hover:text-black border hover:border-primary-dark hover:scale-110 "
      } else if (this.Color == "transparent") {
          add_class+=
            "bg-transparent hover:bg-primary-dark hover:text-white border border-primary-dark hover:border-white hover:scale-110 "
      } else if (this.Color == "white") {
          add_class+=
            "text-white border-white bg-transparent hover:bg-white hover:text-black border border-primary-dark hover:border-white hover:scale-110 "
      }
    } else if (this.Size == "medium") {
      if (this.Type == 'bibutton' || this.Type == 'bilink') {
        add_class += "w-40 "
      } else {
        add_class += "w-80 "
      }
      if (this.Color == "black") {
          add_class+=
            "bg-primary-dark hover:bg-white text-white hover:text-black border hover:border-primary-dark hover:scale-105 "
      } else if (this.Color == "transparent") {
          add_class+=
            "bg-transparent hover:bg-primary-dark hover:text-white border border-primary-dark hover:border-white hover:scale-105 "
      } else if (this.Color == "white") {
          add_class+=
            "text-white bg-transparent hover:bg-white hover:text-black border border-primary-dark hover:border-white hover:scale-105 "
      }
    }
    else if (this.Size == "large") {
      if (this.Type == 'bibutton' || this.Type == 'bilink') {
        add_class += "w-40 "
      } else {
        add_class += "w-80 "
      }
      if (this.Color == "black") {
          add_class+=
            "bg-primary-dark hover:bg-white text-white hover:text-black border hover:border-primary-dark hover:scale-105 "
      } else if (this.Color == "transparent") {
          add_class+=
            "bg-transparent hover:bg-primary-dark hover:text-white border border-primary-dark hover:border-white hover:scale-105 "
      } else if (this.Color == "white") {
          add_class+=
            "text-white bg-transparent hover:bg-white hover:text-black border border-primary-dark hover:border-white hover:scale-105 "
      }
    }
    return {
      add_class: add_class
    }
  },
};
</script>
<style></style>
