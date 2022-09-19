# Bienvenue !

Bienvenue sur le repository Github d'EduBot ! Le bot Discord réalisé pour les étudiants du BUT Informatique d'Ifs **par** les étudiants !  
Ce README est présent pour vous expliquer comment contribuer au bot Discord de manière efficace, et sans problèmes !

## Clone du repository

Tout d'abord, vous devez fork le repository avec la commande :  
`git clone {Le lien de votre fork}`

Pour fork un repository, rendez-vous sur [la page Github du bot](https://github.com/RisingSunLight42/EduBot). Un bouton labellisé "fork" devrait normalement se trouvé en haut à droite du repository. Cela va créer un repository copie de celui du bot sur votre profil Github.

Une fois cela fait, réalisez la commande donnée plus haut.

Les fichiers devraient alors se télécharger sur votre poste de travail : le repository est synchronisé.

## Installation de l'environnement de travail

Une fois cela fait, vous devez installer les librairies permettant de faire fonctionner le bot via la commande `pnpm i`.

**Important !**

Si cette commande ne fonctionne pas, faites `npm i pnpm`.
Si c'est commande ne fonctionne pas non plus, installez [node.js](https://nodejs.org/en/), l'outil d'installation `npm` y est inclu.

> Pour la petite fact, pnpm est un équivalent de npm en optimisé, les librairies prendront moins d'espace sur votre ordinateur.

## Mise en place en place des variables d'environnement

A la racine, créez un fichier `.env` avec le contenu suivant :

```
CLIENT_TOKEN="{le token de votre bot de test}"
CLIENT_ID="{l'identifiant de votre bot de test}"
GUILD_GESTION_ID="{l'identifiant de votre serveur en mode développeur}"
GESTIONNAIRE_ID="{votre identifiant Discord en mode développeur}"
```

### Création d'un bot

Respectez bien ce format, sinon le bot ne pourra pas démarrer correctement !
Pour créer votre bot, rendez-vous sur [cette page](https://discord.com/developers/applications).  
Ensuite, cliquez sur "New Application" puis, sur la page de l'application, cliquez sur l'onglet bot et sur le bouton "Add bot".  
Vous pourrez alors copier le token et l'identifiant du bot. Ne les divulguez pas, sinon d'autres personnes pourront le contrôler et potentiellement faire n'importe quoi avec (ce qui peut résulter à la suppression de votre compte !).

### Activation du mode développeur

Pour le mode développeur, activez-le dans les paramètres Discord onglet "Avancés".

## Lancement en mode test

Pour tester vos changements, faites `npm run dev` dans le terminal lié au dossier de votre répertoire.

## Et voilà !

Vous êtes parés à contribuer ! N'oubliez pas de `commit` vos changements puis de les `push` sur votre repository, c'est à partir de ce dernier que vous pourrez ouvrir une `pull request` sur le repo du bot !
