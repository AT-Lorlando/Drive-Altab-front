import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  css: ["@/assets/styles/styles.css"],
  build: {
    postcss: {
      postcssOptions: require("./postcss.config.js"),
    },
  },
  head: {
    title: "Altab Drive",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=100%, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Altab Drive project",
      },
    ],
    link: [{ rel: "icon", type: "png", href: "/icon.png" }],
  },
  loading: { color: "#3B8070" },
});
