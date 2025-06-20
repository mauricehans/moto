Voici un README complet pour votre projet :

```markdown
# Agde Moto Gattuso

Site web pour le garage moto Agde Moto Gattuso - Vente de motos d'occasion et pièces détachées

## 🏍️ Aperçu du projet

Application web complète comprenant :
- **Frontend** : Site vitrine responsive avec catalogue de motos et pièces détachées
- **Backend** : API REST Django pour la gestion des données
- **Administration** : Interface d'administration pour gérer le contenu

## 🛠️ Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le dev server
- **TailwindCSS** pour le styling
- **React Router** pour la navigation
- **Lucide React** pour les icônes
- **React Query** pour la gestion des données API

### Backend
- **Django 5.0** avec Django REST Framework
- **SQLite** (développement) / **PostgreSQL** (production)
- **Pillow** pour la gestion des images
- **CORS** pour la communication frontend/backend

## 📋 Prérequis

- **Node.js** (version 18 ou supérieure)
- **Python** (version 3.10 ou supérieure)
- **Git**

## 🚀 Installation et lancement

### 1. Cloner le repository

```
git clone https://github.com/votre-username/agde-moto-gattuso.git
cd agde-moto-gattuso
```

### 2. Installation du Frontend

```
# Installer les dépendances npm
npm install
```

### 3. Installation du Backend

```
# Aller dans le dossier backend
cd backend

# Créer un environnement virtuel Python
python -m venv venv

# Activer l'environnement virtuel
# Sur Windows :
venv\Scripts\activate
# Sur macOS/Linux :
source venv/bin/activate

# Installer les dépendances Python
pip install -r requirements.txt

# Créer et appliquer les migrations
python manage.py makemigrations
python manage.py migrate

# Créer un superutilisateur (optionnel)
python manage.py createsuperuser

# Retourner à la racine du projet
cd ..
```

## 🎯 Lancement du projet

### Option 1 : Frontend uniquement (mode démo)

Le frontend peut fonctionner de manière autonome avec des données statiques :

```
npm run dev
```

Le site sera accessible sur : `http://localhost:5173`

### Option 2 : Frontend + Backend (mode complet)

**Terminal 1 - Backend :**
```
cd backend
# Activer l'environnement virtuel si pas déjà fait
venv\Scripts\activate  # Windows
# source venv/bin/activate  # macOS/Linux

python manage.py runserver
```

**Terminal 2 - Frontend :**
```
npm run dev
```

**URLs disponibles :**
- **Site web** : `http://localhost:5173`
- **API Backend** : `http://localhost:8000/api/`
- **Admin Django** : `http://localhost:8000/admin/`

## 📁 Structure du projet

```
agde-moto-gattuso/
├── backend/                    # Backend Django
│   ├── agde_moto/             # Configuration principale
│   ├── blog/                  # App blog
│   ├── motorcycles/           # App motos
│   ├── parts/                 # App pièces détachées
│   ├── manage.py
│   └── requirements.txt
├── src/                       # Frontend React
│   ├── components/            # Composants réutilisables
│   ├── pages/                 # Pages de l'application
│   ├── data/                  # Données statiques
│   ├── types/                 # Types TypeScript
│   └── utils/                 # Utilitaires
├── public/                    # Assets statiques
├── package.json
└── README.md
```

## 🎨 Fonctionnalités

### Frontend
- ✅ **Page d'accueil** avec motos à la une
- ✅ **Catalogue de motos** avec filtres et recherche
- ✅ **Détails des motos** avec galerie d'images
- ✅ **Catalogue de pièces détachées**
- ✅ **Blog** pour les actualités
- ✅ **Page de contact** avec formulaire
- ✅ **Interface d'administration** (demo)
- ✅ **Design responsive** mobile/desktop

### Backend (optionnel)
- ✅ **API REST** pour toutes les données
- ✅ **Administration Django** complète
- ✅ **Gestion des images**
- ✅ **Système d'authentification**
- ✅ **Documentation API**

## 🔧 Configuration

### Variables d'environnement (Backend)

Créez un fichier `.env` dans le dossier `backend/` :

```
SECRET_KEY=votre-clé-secrète-django
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Base de données (optionnel)
DB_NAME=agde_moto
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Interface d'administration

**Accès à l'admin frontend :**
- URL : `http://localhost:5173/admin`
- Login : `admin`
- Mot de passe : `gattuso2024`

## 📱 Scripts disponibles

### Frontend
```
npm run dev        # Serveur de développement
npm run build      # Build de production
npm run preview    # Aperçu du build
npm run lint       # Vérification du code
```

### Backend
```
python manage.py runserver      # Serveur de développement
python manage.py migrate        # Appliquer les migrations
python manage.py makemigrations # Créer les migrations
python manage.py createsuperuser # Créer un admin
```

## 🌐 Déploiement

### Frontend (Netlify, Vercel, etc.)
```
npm run build
```

### Backend (Heroku, Railway, etc.)
Le projet inclut les fichiers de configuration pour le déploiement.

## 🎯 Données de démonstration

Le projet inclut des données de test :
- **6 motos** avec images et descriptions complètes
- **10 pièces détachées** de différentes catégories
- **Articles de blog** d'exemple
- **Galeries d'images** pour chaque produit

## 🐛 Dépannage

### Erreurs courantes

**Port 5173 déjà utilisé :**
```
npm run dev -- --port 3000
```

**Erreurs de migration Django :**
```
cd backend
python manage.py migrate --run-syncdb
```

**Problèmes de CORS :**
Vérifiez que `CORS_ALLOWED_ORIGINS` inclut l'URL du frontend.

## 📞 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Consultez la documentation Django/React
- Vérifiez les logs de la console

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour Agde Moto Gattuso**
```

Ce README est complet et professionnel, il couvre :

1. **Description du projet** claire
2. **Instructions d'installation** détaillées 
3. **Deux modes de lancement** (frontend seul ou complet)
4. **Structure du projet** explicite
5. **Fonctionnalités** listées
6. **Configuration** avec exemples
7. **Scripts** disponibles
8. **Informations de déploiement**
9. **Dépannage** pour les erreurs courantes
10. **Support** et contacts

