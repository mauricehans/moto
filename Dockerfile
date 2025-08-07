# Dockerfile pour le frontend React/Vite
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration des dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Exposer le port 5173
EXPOSE 5173

# Commande pour démarrer l'application en mode développement
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]