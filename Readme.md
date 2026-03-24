# Eco-Agronomist IA - Frontend

## 📝 Présentation

Ce dépôt contient le front-end du projet **Eco-Agronomist IA**, une application web innovante destinée à assister les agronomes et les responsables agricoles. Le projet intègre des diagnostics IA (plantes, produits) en temps réel grâce à un scanner mobile, et fournit des recommandations enrichies (RAG) sur les traitements des cultures.

L'application est conçue pour offrir une ergonomie fluide avec des fonctionnalités de gestion de flux, de valorisation, d'analyse qualité et de gestion des rôles utilisateurs (responsable_qualite, gerant_station, etc.).

---

## 🛠️ Stack Technique

*   **Framework Principal :** [Next.js 16](https://nextjs.org/)
*   **Bibliothèque UI :** [React 19](https://react.dev/)
*   **Styles :** [Tailwind CSS v4](https://tailwindcss.com/)
*   **Animations :** [Framer Motion](https://www.framer.com/motion/)
*   **Icônes :** [Lucide React](https://lucide.dev/)
*   **Langage :** TypeScript

---

## ✨ Fonctionnalités Principales

1.  **Scanner IA Intégré (`MobileScanner`)** :
    *   Diagnostics en temps réel via la capture d'images (plantes, produits, etc.).
    *   Affichage d'images avec des annotations de détection de défauts/maladies (boundingBoxes).
2.  **Système RAG pour Conseils de Traitement** :
    *   Génération de conseils agronomiques contextuels spécifiques aux cultures scannées et aux diagnostics.
3.  **Gestion des Lots & Valorisation** :
    *   Création, mise à jour, suppression (CRUD) et suivi des lots de culture.
    *   Liaison automatique entre les diagnostics et la réception des lots.
4.  **Gestion des Rôles** :
    *   Interfaces adaptées selon le type d'utilisateur connecté (Ex: `responsable_qualite`, `gerant_station`).
5.  **Intégration Backend (FastAPI & MLflow)** :
    *   Appels à l'API backend pour remonter les prédictions et récupérer le scoring des modèles de Machine Learning gérés via MLflow.

---

## 🚀 Démarrage Rapide

### Prérequis
*   [Node.js](https://nodejs.org/) (version 22+ requise d'après le Dockerfile)
*   NPM, Yarn, pnpm ou Bun.
*   Le serveur backend FastAPI localisé par défaut sur le port 8000.

### Installation en Local

1.  Accéder au répertoire de l'application :
    ```bash
    cd app-ergonomie
    ```

2.  Installer les dépendances :
    ```bash
    npm install
    ```

3.  Lancer le serveur de développement avec Turbopack :
    ```bash
    npm run dev
    ```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 🐳 Déploiement Docker

Le projet `app-ergonomie` inclut un `Dockerfile` optimisé (basé sur `node:22-alpine`) pour fonctionner de manière conteneurisée.

1.  **Construire l'image Docker** :
    ```bash
    cd app-ergonomie
    docker build -t frontend_app .
    ```

2.  **Lancer le conteneur** :
    ```bash
    docker run -p 3000:3000 frontend_app
    ```
    
> **Note :** Le frontend fait généralement partie de l'orchestration Docker globale du projet via `docker-compose.yml`. Veillez à ce que le contexte Docker Compose couvre le dossier `app-ergonomie`.
