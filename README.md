# 🏍️ Agde Moto Gattuso

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Security Score](https://img.shields.io/badge/Security%20Score-9%2F10-brightgreen.svg)](#-sécurité)

*Site web professionnel pour le garage moto Agde Moto Gattuso - Vente de motos d'occasion et pièces détachées avec interface d'administration complète*

## 📋 Table des matières

- [🏍️ Aperçu du projet](#️-aperçu-du-projet)
- [✨ Fonctionnalités](#-fonctionnalités)
- [🛠️ Technologies utilisées](#️-technologies-utilisées)
- [🏗️ Architecture du projet](#️-architecture-du-projet)
- [🚀 Installation et lancement](#-installation-et-lancement)
- [🔧 Configuration](#-configuration)
- [🔒 Sécurité](#-sécurité)
- [🚀 Déploiement](#-déploiement)
- [📊 Performance](#-performance)
- [🤝 Contribution](#-contribution)
- [📄 Licence](#-licence)

---

## 🏍️ Aperçu du projet

Ce projet est une application web complète conçue pour le garage **Agde Moto Gattuso**. Elle offre une vitrine en ligne pour la vente de motos d'occasion et de pièces détachées, ainsi qu'un blog pour les actualités et les événements.

L'application se compose de trois parties principales :

- **Frontend** : Un site web moderne et responsive, développé avec React et TypeScript, qui offre une expérience utilisateur fluide et agréable.
- **Backend** : Une API RESTful robuste, basée sur Django et Django REST Framework, qui gère toutes les données de l'application.
- **Administration** : Une interface d'administration conviviale, intégrée au backend, qui permet de gérer facilement le contenu du site.

---

## ✨ Fonctionnalités

### Frontend

- ✅ **Page d'accueil** : Présentation du garage et des motos à la une.
- ✅ **Catalogue de motos** : Liste complète des motos d'occasion, avec des options de recherche et de filtrage avancées.
- ✅ **Détails des motos** : Page détaillée pour chaque moto, avec une galerie d'images, les caractéristiques techniques et un formulaire de contact.
- ✅ **Catalogue de pièces détachées** : Vente de pièces détachées neuves et d'occasion, classées par catégorie.
- ✅ **Blog** : Section d'actualités pour informer les clients des derniers événements et promotions.
- ✅ **Page de contact** : Formulaire de contact et carte de localisation du garage.
- ✅ **Interface d'administration** : Interface privée pour la gestion du contenu (motos, pièces, articles de blog, etc.).
- ✅ **Design responsive** : Le site est entièrement adaptable aux différents appareils (ordinateurs, tablettes, smartphones).

### Backend

- ✅ **API RESTful** : Une API complète pour la gestion des motos, des pièces détachées, des articles de blog et des utilisateurs.
- ✅ **Administration Django** : Interface d'administration complète et sécurisée.
- ✅ **Gestion des images** : Téléchargement et optimisation des images pour une performance optimale.
- ✅ **Système d'authentification** : Gestion des utilisateurs et des permissions.
- ✅ **Documentation API** : Documentation claire et détaillée de l'API.

---

## 🛠️ Technologies utilisées

### Frontend

| Technologie | Description |
|---|---|
| **React 18** | Bibliothèque JavaScript pour la création d'interfaces utilisateur. |
| **TypeScript** | Surensemble de JavaScript qui ajoute des types statiques. |
| **Vite** | Outil de build et de développement rapide pour les projets web modernes. |
| **TailwindCSS** | Framework CSS pour un design rapide et personnalisé. |
| **React Router** | Bibliothèque de routage pour les applications React. |
| **Lucide React** | Bibliothèque d'icônes légère et personnalisable. |
| **React Query** | Bibliothèque pour la gestion des données et du cache côté client. |

### Backend

| Technologie | Description |
|---|---|
| **Django 5.0** | Framework web Python de haut niveau. |
| **Django REST Framework** | Boîte à outils puissante pour la création d'API web. |
| **PostgreSQL** | Système de gestion de base de données relationnelle open-source. |
| **Pillow** | Bibliothèque de traitement d'images pour Python. |
| **CORS** | Mécanisme de sécurité pour les requêtes HTTP entre différents domaines. |
| **Docker** | Conteneurisation pour un déploiement simplifié et cohérent. |

---

## 🏗️ Architecture du projet

Le projet est structuré en deux parties principales :

- **`backend/`** : Contient le code source du backend Django.
  - **`agde_moto/`** : Configuration principale du projet Django.
  - **`blog/`** : Application Django pour la gestion du blog.
  - **`motorcycles/`** : Application Django pour la gestion des motos.
  - **`parts/`** : Application Django pour la gestion des pièces détachées.
  - **`garage/`** : Application Django pour la gestion des paramètres du garage.
  - **`manage.py`** : Utilitaire de ligne de commande de Django.
  - **`requirements.txt`** : Liste des dépendances Python.
  - **`Dockerfile`** : Configuration Docker pour le backend.

- **`src/`** : Contient le code source du frontend React.
  - **`components/`** : Composants React réutilisables.
  - **`pages/`** : Pages principales de l'application.
  - **`data/`** : Données statiques (motos, pièces, etc.).
  - **`types/`** : Définitions de types TypeScript.
  - **`utils/`** : Fonctions utilitaires.
  - **`hooks/`** : Hooks React personnalisés.
  - **`services/`** : Services pour les appels API.

---

## 🚀 Installation et lancement

### Prérequis

- **Docker** et **Docker Compose** (recommandé)
- **Node.js** (version 18 ou supérieure) - pour le développement frontend uniquement
- **Git**

### Option 1 : Lancement avec Docker (Recommandé)

#### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/agde-moto-gattuso.git
cd agde-moto-gattuso
```

#### 2. Lancement complet du projet

```bash
# Démarrer tous les services (base de données + backend)
docker-compose up -d

# Attendre que les services soient prêts, puis appliquer les migrations
docker-compose exec backend python manage.py migrate

# Créer un superutilisateur pour l'administration
docker-compose exec backend python manage.py createsuperuser

# (Optionnel) Peupler la base avec des données de test
docker-compose exec backend python populate_db.py
```

#### 3. Lancement du frontend (développement)

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

#### 4. Script de démarrage automatisé

Vous pouvez utiliser le script fourni :

```bash
# Démarrer uniquement la base de données
start-db.bat

# Ou créer un script complet start-project.bat :
```

```batch
@echo off
echo Démarrage du projet AGDE Moto...
docker-compose up -d
echo Attente du démarrage des services...
timeout /t 15
echo Exécution des migrations...
docker-compose exec backend python manage.py migrate
echo Projet prêt !
echo Frontend: http://localhost:5173
echo Backend: http://localhost:8000
echo Admin: http://localhost:8000/admin
```

### Option 2 : Installation manuelle (Développement)

#### 1. Installation du Backend

```bash
# Accéder au dossier backend
cd backend

# Créer un environnement virtuel
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows
venv\Scripts\activate
# Sur macOS/Linux
source venv/bin/activate

# Installer les dépendances
pip install -r requirements.txt

# Configurer les variables d'environnement
cp .env.example .env
# Éditer le fichier .env selon vos besoins

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur
python manage.py createsuperuser
```

#### 2. Installation du Frontend

```bash
# Accéder au dossier racine du projet
cd ..

# Installer les dépendances
npm install
```

#### 3. Lancement manuel

**Terminal 1 : Backend**

```bash
cd backend
python manage.py runserver
```

**Terminal 2 : Frontend**

```bash
npm run dev
```

### URLs disponibles

- **Site web** : `http://localhost:5173`
- **API Backend** : `http://localhost:8000/api/`
- **Admin Django** : `http://localhost:8000/admin/`
- **Documentation API** : `http://localhost:8000/api/schema/swagger-ui/`

### Commandes Docker utiles

```bash
# Voir les logs des services
docker-compose logs -f

# Redémarrer un service spécifique
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Reconstruire les images
docker-compose up -d --build

# Exécuter des commandes Django
docker-compose exec backend python manage.py makemigrations
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py collectstatic

# Accéder au shell Django
docker-compose exec backend python manage.py shell

# Accéder à la base de données PostgreSQL
docker exec -it agde_moto_db psql -U agde_user -d agde_moto
```

---

## 🔧 Configuration

### Variables d'environnement

Copiez le fichier `.env.example` vers `.env` dans le dossier `backend/` et configurez les variables suivantes :

```bash
# Configuration de base de données (Docker)
DB_NAME=agde_moto
DB_USER=agde_user
DB_PASSWORD=agde_password123
DB_HOST=localhost  # ou 'db' si vous utilisez Docker Compose
DB_PORT=5432

# Django Configuration
DEBUG=True
SECRET_KEY=votre-cle-secrete-unique-et-complexe
ALLOWED_HOSTS=localhost,127.0.0.1

# Configuration Email pour la réinitialisation de mot de passe
EMAIL_BACKEND=django.core.mail.backends.console.EmailBackend
EMAIL_HOST_USER=noreply@agdemoto.com
EMAIL_HOST_PASSWORD=testpassword

# Configuration JWT
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440

# Configuration CORS
CORS_ALLOW_ALL_ORIGINS=True  # Développement uniquement
```

### Configuration de développement

Pour le développement local, les valeurs par défaut sont suffisantes. Assurez-vous simplement que :

- `DEBUG=True` (par défaut)
- `ALLOWED_HOSTS` inclut `localhost` et `127.0.0.1`
- `CORS_ALLOW_ALL_ORIGINS=True` (par défaut en développement)
- Les paramètres de base de données correspondent à ceux du `docker-compose.yml`

---

## 🔒 Sécurité

### 🛡️ Mesures de sécurité implémentées

- ✅ **Configuration sécurisée** : Variables d'environnement, DEBUG=False en production
- ✅ **Authentification renforcée** : JWT avec rotation, limitation de taux, blocage temporaire
- ✅ **Protection contre les attaques** : DDoS, injection SQL, XSS, CSRF
- ✅ **En-têtes de sécurité** : CSP, HSTS, X-Frame-Options, X-XSS-Protection
- ✅ **Logging de sécurité** : Surveillance des tentatives suspectes
- ✅ **Permissions strictes** : IsAuthenticated par défaut, AllowAny uniquement pour les endpoints publics

### 🚨 Score de sécurité : 9/10

Consultez le fichier [SECURITY.md](./SECURITY.md) pour plus de détails sur les mesures de sécurité.

### Recommandations pour la production

1. **Générer une SECRET_KEY unique** et complexe
2. **Configurer HTTPS** avec certificat SSL/TLS valide
3. **Utiliser PostgreSQL** au lieu de SQLite
4. **Configurer Redis** pour le cache et les sessions
5. **Surveiller les logs** de sécurité régulièrement
6. **Effectuer des audits** de sécurité périodiques

---

## 🚀 Déploiement

### Déploiement avec Docker (Recommandé)

```bash
# Construire et lancer avec Docker Compose
docker-compose up -d --build

# Appliquer les migrations
docker-compose exec backend python manage.py migrate

# Créer un superutilisateur
docker-compose exec backend python manage.py createsuperuser

# Collecter les fichiers statiques
docker-compose exec backend python manage.py collectstatic --noinput

# Peupler la base avec des données initiales (optionnel)
docker-compose exec backend python populate_db.py
```

### Déploiement manuel

#### Backend (Django)

```bash
# Production avec Gunicorn
pip install gunicorn
gunicorn agde_moto.wsgi:application --bind 0.0.0.0:8000

# Ou avec uWSGI
pip install uwsgi
uwsgi --http :8000 --module agde_moto.wsgi
```

#### Frontend (React)

```bash
# Build de production
npm run build

# Servir avec un serveur web (nginx, apache, etc.)
# Les fichiers sont dans le dossier dist/
```

### Configuration Nginx (exemple)

```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name votre-domaine.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Admin
    location /admin/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Media files
    location /media/ {
        alias /path/to/backend/media/;
    }
}
```

---

## 📊 Performance

### Optimisations implémentées

- ✅ **Cache intelligent** : React Query pour le frontend, cache Django pour le backend
- ✅ **Optimisation des images** : Compression et redimensionnement automatique
- ✅ **Pagination** : Limitation à 20 éléments par page
- ✅ **Lazy loading** : Chargement différé des images
- ✅ **Bundle optimization** : Vite pour un build optimisé
- ✅ **Database optimization** : Index sur les champs fréquemment utilisés
- ✅ **Conteneurisation** : Docker pour des performances cohérentes

### Métriques de performance

- **Temps de chargement initial** : < 2 secondes
- **First Contentful Paint** : < 1.5 secondes
- **Largest Contentful Paint** : < 2.5 secondes
- **Cumulative Layout Shift** : < 0.1

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes suivantes :

1. **Forker** le projet.
2. Créer une nouvelle branche (`git checkout -b feature/nouvelle-fonctionnalite`).
3. **Commiter** vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. **Pusher** vers la branche (`git push origin feature/nouvelle-fonctionnalite`).
5. Ouvrir une **Pull Request**.

### 🐛 Signalement de bugs

Pour signaler un bug, veuillez :

1. Vérifier que le bug n'a pas déjà été signalé
2. Créer une issue avec le template "Bug Report"
3. Inclure les étapes pour reproduire le problème
4. Ajouter des captures d'écran si nécessaire

### 💡 Demandes de fonctionnalités

Pour proposer une nouvelle fonctionnalité :

1. Créer une issue avec le template "Feature Request"
2. Décrire clairement la fonctionnalité souhaitée
3. Expliquer pourquoi cette fonctionnalité serait utile

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

## 📞 Support

Pour toute question ou problème :

- 📧 **Email** : support@agde-moto-gattuso.fr
- 🐛 **Issues** : [GitHub Issues](https://github.com/votre-username/agde-moto-gattuso/issues)
- 📖 **Documentation** : [Wiki du projet](https://github.com/votre-username/agde-moto-gattuso/wiki)
- 🔒 **Sécurité** : Voir [SECURITY.md](./SECURITY.md)

---

## 🏆 Remerciements

- **Agde Moto Gattuso** pour la confiance accordée
- **Communauté Open Source** pour les outils et bibliothèques utilisés
- **Contributeurs** qui ont participé au développement

---

**Développé avec ❤️ pour Agde Moto Gattuso**

*Dernière mise à jour : Décembre 2024*