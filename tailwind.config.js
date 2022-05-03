module.exports = {
    content: [
        "./components/*.{vue,js}",
        "./components/**/*.{vue,js}",
        "./pages/*.vue",
        "./pages/**/*.vue",
        "./plugins/**/*.{js,ts}",
        // "./*.{vue,js,ts}",
        // "./nuxt.config.{js,ts}",
    ],
    theme: {
        extend: {
            colors: {
                "primary-dark": "#010106",
            }
        },
    },
    plugins: [],
}