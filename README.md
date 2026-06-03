# ☁️ S3 Cloud Drive - Interface React

Application Web permettant de gérer un espace de stockage Amazon S3 à la manière d'un Drive. Développée en **React (JavaScript)** avec **Vite** et le **SDK AWS v3**.

## Fonctionnalités réalisées
1. **Listing du contenu** : Affichage des fichiers d'un bucket avec leurs métadonnées (Nom, Type/Extension, Taille convertie, Date de modification).
2. **Téléversement (Upload)** : Envoi de fichiers locaux vers S3 avec gestion des fichiers du navigateur (via `@aws-sdk/lib-storage`).
3. **Téléchargement** : Récupération sécurisée des fichiers via la génération d'URL présignées temporaires (valables 5 minutes).
4. **Suppression** : Retrait définitif des éléments du bucket avec rafraîchissement automatique de l'interface.
5. **Bonus 1 & 2 (Configuration Front-end)** : L'application est totalement variabilisée. L'utilisateur final saisit ses propres identifiants (Access Key, Secret Key, Région, Bucket) directement dans l'interface pour s'y connecter.

## 🛠️ Installation et Lancement local

1. Cloner ce dépôt Git.
2. Installer les dépendances du projet :
   ```bash
   npm install
3. Lancer le projet : 
   ```bash
   npm run dev 
   (le projet ce lancera sur le http://localhost:5173/ )