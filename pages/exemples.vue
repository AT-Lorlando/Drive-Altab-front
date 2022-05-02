<template>
    <div class="w-full h-full bg-primary-dark flex flex-col justify-center text-white text-xl z-20">
        <div class="w-2/5 self-center justify-center items-center flex flex-col text-center">
            <h2>
            Qu'est-ce qu'Altab ?
            </h2>
            <p>
            Altab est une entreprise de communication digitale. Ce domaine regroupe aussi bien la prise de photo que le developpement de site ou d'applications. drive.altab.tech est un site de gestion de photos, regroupant mes photos pour les partagers et pour vous permettre de les consulter/télécharger avec la meilleure qualité possible. Ce site permet aussi de me contacter si vous avez une demande particulère telle que la retouche d'une photo.
            </p>
            <h2>
            Que puis-je faire avec ces photos ?
            </h2>
            <p>
            Les photos auxquelles vous avez accès sont libre de droit. Certains dossiers peuvent être protégés par un mot de passe, les photos contenues dans ce dossier sont libre de droit pour ceux ayant accès au dossier.
            <br>
            Si une photo vous plaît, vous pouvez donc la télécharger et l'utiliser. Vous pouvez aussi me demander de la retoucher/de l'editer pour l'enjoliver.
            </p>
            <AltabButton class="mt-2" Type="link" Route="/exemples" Title="Voir des exemples" Color="white" Size="small" />
            <h2>
            Je ne veux pas apparaître ici.
            </h2>
            <p>
            Si vous ne voulez pas apparaître ici, vous pouvez me contacter afin de supprimer au plus vite les photos concernées. Votre droit à l'image s'applique, tout en sachant que photographier une foule est possible mais les individus ne doivent pas être pris en gros plan.
            </p>
        
        </div>
    </div>
</template>
<script setup>
</script>
<style scoped>
h2 {
    @apply text-3xl mt-4 mb-2
}
</style>