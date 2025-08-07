# Guide Docker pour AGDE Moto

## Prérequis
- Docker
- Docker Compose

## Démarrage rapide

### 1. Construire et démarrer tous les services
```bash
docker-compose up --build
```

### 2. Démarrer en arrière-plan
```bash
docker-compose up -d --build
```

### 3. Arrêter les services
```bash
docker-compose down
```

## Services disponibles

- **Frontend (React/Vite)**: http://localhost:3002
- **Backend (Django)**: http://localhost:8000
- **Base de données (PostgreSQL)**: localhost:5432

## Structure des services

### Frontend
- Port: 3002 (externe) -> 5173 (interne)
- Technologie: React + Vite
- Hot reload activé

### Backend
- Port: 8000
- Technologie: Django
- API REST disponible sur `/api/`

### Base de données
- Port: 5432
- Technologie: PostgreSQL 15
- Nom de la base: `agde_moto`
- Utilisateur: `agde_user`

## Commandes utiles

### Voir les logs
```bash
# Tous les services
docker-compose logs -f

# Service spécifique
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f db
```

### Reconstruire un service spécifique
```bash
docker-compose up --build frontend
docker-compose up --build backend
```

### Accéder au shell d'un conteneur
```bash
# Frontend
docker-compose exec frontend sh

# Backend
docker-compose exec backend bash

# Base de données
docker-compose exec db psql -U agde_user -d agde_moto
```

### Nettoyer les volumes et images
```bash
# Arrêter et supprimer les conteneurs, réseaux et volumes
docker-compose down -v

# Supprimer les images
docker-compose down --rmi all
```

## Développement

- Les modifications du code frontend sont automatiquement rechargées
- Les modifications du code backend nécessitent un redémarrage du conteneur
- La base de données persiste les données dans un volume Docker

## Variables d'environnement

### Frontend
- `VITE_API_URL`: URL de l'API backend (définie sur http://localhost:8000)

### Backend
- `DB_HOST`: Hôte de la base de données
- `DB_NAME`: Nom de la base de données
- `DB_USER`: Utilisateur de la base de données
- `DB_PASSWORD`: Mot de passe de la base de données

## 🔐 Sécurité et Production

### ⚠️ IMPORTANT - Avant la mise en production

**CRITIQUE :** Les valeurs par défaut ne sont PAS sécurisées pour la production !

#### 1. Génération des secrets sécurisés
```bash
# Générer tous les secrets nécessaires
cd scripts
python generate_secrets.py
```

#### 2. Configuration des variables d'environnement
Copiez `.env.example` vers `.env` et remplacez TOUTES les valeurs `CHANGEZ-*` :

```bash
cp backend/.env.example backend/.env
# Éditez backend/.env avec les valeurs générées
```

**Variables critiques à changer :**
- `SECRET_KEY` : Clé secrète Django (50+ caractères)
- `DB_PASSWORD` : Mot de passe PostgreSQL (32+ caractères)
- `JWT_SECRET_KEY` : Clé JWT (64+ caractères)
- `REDIS_PASSWORD` : Mot de passe Redis (32+ caractères)

#### 3. Configuration Docker sécurisée

**docker-compose.yml pour la production :**
```yaml
version: '3.8'
services:
  db:
    environment:
      - POSTGRES_PASSWORD=${DB_PASSWORD}  # Depuis .env
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - backend
    # Ne pas exposer le port en production
    # ports:
    #   - "5432:5432"
  
  backend:
    environment:
      - SECRET_KEY=${SECRET_KEY}
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    networks:
      - backend
      - frontend
  
  frontend:
    # Utiliser un serveur web en production (nginx)
    networks:
      - frontend

networks:
  backend:
    driver: bridge
    internal: true  # Réseau interne seulement
  frontend:
    driver: bridge

volumes:
  postgres_data:
    driver: local
```

#### 4. Checklist de sécurité

Avant le déploiement, consultez :
- 📋 `scripts/PRODUCTION_SECURITY_CHECKLIST.md` - Checklist complète
- 📖 `scripts/SECURITY_GUIDE.md` - Guide détaillé
- ⚙️ `backend/agde_moto/settings_production.py` - Configuration sécurisée

#### 5. Tests de sécurité

```bash
# Vérifications Django
docker-compose exec backend python manage.py check --deploy
docker-compose exec backend python manage.py check --tag security

# Test des connexions sécurisées
curl -I https://votre-domaine.com
```

### 🚨 Alertes de sécurité

**JAMAIS en production :**
- `DEBUG=True`
- Mots de passe par défaut
- Ports de base de données exposés publiquement
- `CORS_ALLOW_ALL_ORIGINS=True`
- Certificats SSL auto-signés

**TOUJOURS en production :**
- HTTPS avec certificats valides
- Mots de passe complexes et uniques
- Logs de sécurité activés
- Sauvegardes automatisées
- Monitoring des accès

## Automatisation des sauvegardes

### Vue d'ensemble
Le système AGDE Moto inclut un système complet d'automatisation des sauvegardes pour protéger vos données PostgreSQL. Les scripts sont situés dans le répertoire `scripts/`.

### Scripts disponibles

#### 1. Script de sauvegarde (`backup_db.sh`)
Crée des sauvegardes automatisées avec horodatage de la base de données PostgreSQL.

**Fonctionnalités :**
- Sauvegarde compressée avec horodatage
- Vérification d'intégrité automatique
- Logging détaillé
- Gestion des erreurs
- Nettoyage automatique des sauvegardes temporaires

**Utilisation :**
```bash
# Sauvegarde manuelle
./scripts/backup_db.sh

# Rendre le script exécutable
chmod +x scripts/backup_db.sh
```

#### 2. Script de nettoyage (`cleanup_backups.sh`)
Gère la rétention des sauvegardes selon une politique définie.

**Politique de rétention :**
- **Quotidienne** : 7 jours
- **Hebdomadaire** : 30 jours (1 sauvegarde par semaine)
- **Mensuelle** : 365 jours (1 sauvegarde par mois)

**Utilisation :**
```bash
# Nettoyage manuel
./scripts/cleanup_backups.sh

# Rendre le script exécutable
chmod +x scripts/cleanup_backups.sh
```

#### 3. Script de restauration (`restore_db.sh`)
Restaure une sauvegarde de la base de données avec sécurité intégrée.

**Fonctionnalités :**
- Sauvegarde de sécurité automatique avant restauration
- Vérification d'intégrité des fichiers
- Mode interactif avec confirmation
- Mode forcé pour l'automatisation
- Gestion des connexions actives

**Utilisation :**
```bash
# Lister les sauvegardes disponibles
./scripts/restore_db.sh --list

# Restauration interactive
./scripts/restore_db.sh agde_moto_backup_20240107_143000.sql.gz

# Restauration forcée (sans confirmation)
./scripts/restore_db.sh --force backup.sql.gz

# Aide
./scripts/restore_db.sh --help
```

### Configuration automatisée avec Cron

#### Installation des tâches cron
1. Ouvrir l'éditeur crontab :
```bash
crontab -e
```

2. Ajouter la configuration recommandée :
```bash
# Variables d'environnement
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
SHELL=/bin/bash
MAILTO=admin@agde-moto.com

# Sauvegarde quotidienne à 2h00
0 2 * * * /path/to/agde_moto/scripts/backup_db.sh >> /var/log/agde_moto_cron.log 2>&1

# Nettoyage hebdomadaire le dimanche à 3h00
0 3 * * 0 /path/to/agde_moto/scripts/cleanup_backups.sh >> /var/log/agde_moto_cron.log 2>&1
```

3. Vérifier l'installation :
```bash
crontab -l
```

#### Autres fréquences de sauvegarde
```bash
# Sauvegarde toutes les 6 heures
0 */6 * * * /path/to/scripts/backup_db.sh

# Sauvegarde deux fois par jour (6h00 et 18h00)
0 6,18 * * * /path/to/scripts/backup_db.sh

# Sauvegarde uniquement les jours ouvrables
0 1 * * 1-5 /path/to/scripts/backup_db.sh
```

### Configuration des répertoires

#### Structure recommandée
```
/var/backups/agde_moto/          # Répertoire principal des sauvegardes
├── agde_moto_backup_*.sql.gz    # Sauvegardes quotidiennes
├── agde_moto_weekly_*.sql.gz    # Sauvegardes hebdomadaires
└── agde_moto_monthly_*.sql.gz   # Sauvegardes mensuelles

/var/log/                        # Logs
├── agde_moto_backup.log         # Log des sauvegardes
└── agde_moto_cron.log          # Log des tâches cron
```

#### Création des répertoires
```bash
# Créer les répertoires nécessaires
sudo mkdir -p /var/backups/agde_moto
sudo chown $USER:$USER /var/backups/agde_moto
sudo chmod 755 /var/backups/agde_moto

# Créer les fichiers de log
sudo touch /var/log/agde_moto_backup.log
sudo touch /var/log/agde_moto_cron.log
sudo chown $USER:$USER /var/log/agde_moto_*.log
```

### Surveillance et monitoring

#### Vérification de l'état des sauvegardes
```bash
# Voir les dernières sauvegardes
ls -lht /var/backups/agde_moto/

# Vérifier les logs
tail -f /var/log/agde_moto_backup.log

# Vérifier l'espace disque
df -h /var/backups/agde_moto/
```

#### Alertes par email
Pour recevoir des notifications en cas de problème, configurez la variable `MAILTO` dans cron :
```bash
MAILTO=admin@agde-moto.com
```

#### Script de vérification de santé
Créez un script pour vérifier que les sauvegardes sont récentes :
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/agde_moto"
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "ALERTE: Aucune sauvegarde trouvée" | mail -s "Alerte sauvegarde AGDE Moto" admin@agde-moto.com
else
    BACKUP_AGE=$(find "$LATEST_BACKUP" -mtime +1)
    if [ -n "$BACKUP_AGE" ]; then
        echo "ALERTE: La dernière sauvegarde date de plus de 24h" | mail -s "Alerte sauvegarde AGDE Moto" admin@agde-moto.com
    fi
fi
```

### Procédures de récupération

#### En cas de perte de données
1. **Arrêter l'application** :
```bash
docker-compose down
```

2. **Lister les sauvegardes disponibles** :
```bash
./scripts/restore_db.sh --list
```

3. **Restaurer la sauvegarde** :
```bash
# Redémarrer uniquement la base de données
docker-compose up -d db

# Attendre que la base soit prête
sleep 10

# Restaurer la sauvegarde
./scripts/restore_db.sh agde_moto_backup_20240107_143000.sql.gz
```

4. **Redémarrer l'application** :
```bash
docker-compose up -d
```

#### Test de restauration
Il est recommandé de tester régulièrement la procédure de restauration :
```bash
# Créer un environnement de test
docker-compose -f docker-compose.test.yml up -d db

# Tester la restauration
./scripts/restore_db.sh --force latest_backup.sql.gz

# Vérifier l'intégrité des données
docker-compose -f docker-compose.test.yml exec db psql -U agde_user -d agde_moto -c "SELECT COUNT(*) FROM information_schema.tables;"
```

### Sécurité des sauvegardes

#### Chiffrement (optionnel)
Pour chiffrer les sauvegardes sensibles :
```bash
# Chiffrer une sauvegarde
gpg --symmetric --cipher-algo AES256 backup.sql.gz

# Déchiffrer une sauvegarde
gpg --decrypt backup.sql.gz.gpg > backup.sql.gz
```

#### Sauvegarde externe
Pour une sécurité maximale, copiez régulièrement les sauvegardes vers un stockage externe :
```bash
# Synchronisation avec un serveur distant
rsync -avz /var/backups/agde_moto/ user@backup-server:/backups/agde_moto/

# Sauvegarde vers le cloud (exemple avec rclone)
rclone sync /var/backups/agde_moto/ cloud:agde-moto-backups/
```

## Résolution de problèmes

### Le frontend ne se connecte pas au backend
- Vérifiez que `VITE_API_URL` pointe vers http://localhost:8000
- Assurez-vous que le backend est démarré et accessible

### Erreurs de base de données
- Vérifiez que le service `db` est démarré
- Consultez les logs avec `docker-compose logs db`

### Problèmes de permissions
- Sur Linux/Mac, vous pourriez avoir besoin d'ajuster les permissions des fichiers
- Utilisez `sudo` si nécessaire pour les commandes Docker

### Problèmes de sauvegarde

#### Erreur "Conteneur non trouvé"
- Vérifiez que le conteneur PostgreSQL est en cours d'exécution :
```bash
docker ps | grep agde_moto_db
```

#### Espace disque insuffisant
- Vérifiez l'espace disponible :
```bash
df -h /var/backups/agde_moto/
```
- Lancez le nettoyage des anciennes sauvegardes :
```bash
./scripts/cleanup_backups.sh
```

#### Sauvegarde corrompue
- Vérifiez l'intégrité du fichier :
```bash
gzip -t backup_file.sql.gz
```
- Utilisez une sauvegarde plus ancienne si nécessaire

#### Échec de restauration
- Vérifiez les logs de restauration
- Assurez-vous que le conteneur PostgreSQL est accessible
- Vérifiez les permissions sur les fichiers de sauvegarde