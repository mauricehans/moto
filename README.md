# Agde Moto Gattuso

*Site web pour le garage moto Agde Moto Gattuso - Vente de motos d'occasion et pièces détachées*

---

## 🏍️ Aperçu du projet

Ce projet est une application web complète conçue pour le garage **Agde Moto Gattuso**. Elle offre une vitrine en ligne pour la vente de motos d'occasion et de pièces détachées, ainsi qu'un blog pour les actualités et les événements.

L'application se compose de trois parties principales :

- **Frontend** : Un site web moderne et responsive, développé avec React et TypeScript, qui offre une expérience utilisateur fluide et agréable.
- **Backend** : Une API RESTful robuste, basée sur Django et Django REST Framework, qui gère toutes les données de l'application.
- **Administration** : Une interface d'administration conviviale, intégrée au backend, qui permet de gérer facilement le contenu du site.

---

## 🎨 Fonctionnalités

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

---

## ARCHITECTURE DU PROJET

Le projet est structuré en deux parties principales :

- **`backend/`** : Contient le code source du backend Django.
  - **`agde_moto/`** : Configuration principale du projet Django.
  - **`blog/`** : Application Django pour la gestion du blog.
  - **`motorcycles/`** : Application Django pour la gestion des motos.
  - **`parts/`** : Application Django pour la gestion des pièces détachées.
  - **`manage.py`** : Utilitaire de ligne de commande de Django.
  - **`requirements.txt`** : Liste des dépendances Python.

- **`src/`** : Contient le code source du frontend React.
  - **`components/`** : Composants React réutilisables.
  - **`pages/`** : Pages principales de l'application.
  - **`data/`** : Données statiques (motos, pièces, etc.).
  - **`types/`** : Définitions de types TypeScript.
  - **`utils/`** : Fonctions utilitaires.

---

## 🚀 Installation et lancement

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **Python** (version 3.10 ou supérieure)
- **Git**

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/agde-moto-gattuso.git
cd agde-moto-gattuso
```

### 2. Installation du Backend

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

# Appliquer les migrations
python manage.py migrate

# Créer un superutilisateur (pour l'administration)
python manage.py createsuperuser
```

### 3. Installation du Frontend

```bash
# Accéder au dossier racine du projet
cd ..

# Installer les dépendances
npm install
```

### 4. Lancement du projet

**Terminal 1 : Lancement du backend**

```bash
cd backend
python manage.py runserver
```

**Terminal 2 : Lancement du frontend**

```bash
npm run dev
```

**URLs disponibles**

- **Site web** : `http://localhost:5173`
- **API Backend** : `http://localhost:8000/api/`
- **Admin Django** : `http://localhost:8000/admin/`

---

## CONTRIBUTION

Les contributions sont les bienvenues ! Si vous souhaitez contribuer à ce projet, veuillez suivre les étapes suivantes :

1. **Forker** le projet.
2. Créer une nouvelle branche (`git checkout -b feature/nouvelle-fonctionnalite`).
3. **Commiter** vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`).
4. **Pusher** vers la branche (`git push origin feature/nouvelle-fonctionnalite`).
5. Ouvrir une **Pull Request**.

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

**Développé avec ❤️ pour Agde Moto Gattuso**