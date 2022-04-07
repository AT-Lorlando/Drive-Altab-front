<template>
    <div class="flex bg-blue-400 flex-col w-full h-full pt-8 space-y-16">
        <div>
            Yo les systèmes
        </div>
        <div>
            Terminaux
        </div>
        <div>
            Footer
        </div>
        <!-- An inscription modal with 2 buttons -->
        <div class="flex flex-col items-center justify-center">
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                <router-link to="/inscription">
                    Inscription
                </router-link>
            </button>
            <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
                <router-link to="/connexion">
                    Connexion
                </router-link>
            </button>
            </div>

    </div>
</template>