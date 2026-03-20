# Dockerfile simple pour le Frontend Next.js

FROM node:20-alpine

WORKDIR /app

# Installation des dépendances
COPY package.json package-lock.json ./
RUN npm install

# Copie du code source et build
COPY . .
RUN npm run build

# Exposition du port
EXPOSE 3000

# Lancement de l'application
CMD ["npm", "start"]
