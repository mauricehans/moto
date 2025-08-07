# Scripts de Sauvegarde AGDE Moto

Ce répertoire contient les scripts d'automatisation des sauvegardes pour la base de données PostgreSQL du système AGDE Moto.

## Scripts disponibles

### 🔄 `backup_db.sh` - Script de sauvegarde
**Fonction :** Crée des sauvegardes automatisées avec horodatage de la base de données PostgreSQL.

**Utilisation :**
```bash
# Rendre le script exécutable
chmod +x backup_db.sh

# Lancer une sauvegarde manuelle
./backup_db.sh
```

**Fonctionnalités :**
- ✅ Sauvegarde compressée avec horodatage
- ✅ Vérification d'intégrité automatique
- ✅ Logging détaillé
- ✅ Gestion des erreurs
- ✅ Nettoyage automatique des fichiers temporaires

---

### 🧹 `cleanup_backups.sh` - Script de nettoyage
**Fonction :** Gère la rétention des sauvegardes selon une politique définie.

**Utilisation :**
```bash
# Rendre le script exécutable
chmod +x cleanup_backups.sh

# Lancer le nettoyage manuel
./cleanup_backups.sh
```

**Politique de rétention :**
- 📅 **Quotidienne** : 7 jours
- 📅 **Hebdomadaire** : 30 jours (1 sauvegarde par semaine)
- 📅 **Mensuelle** : 365 jours (1 sauvegarde par mois)

---

### 🔄 `restore_db.sh` - Script de restauration
**Fonction :** Restaure une sauvegarde de la base de données avec sécurité intégrée.

**Utilisation :**
```bash
# Rendre le script exécutable
chmod +x restore_db.sh

# Lister les sauvegardes disponibles
./restore_db.sh --list

# Restauration interactive (avec confirmation)
./restore_db.sh agde_moto_backup_20240107_143000.sql.gz

# Restauration forcée (sans confirmation)
./restore_db.sh --force backup.sql.gz

# Afficher l'aide
./restore_db.sh --help
```

**Fonctionnalités :**
- ✅ Sauvegarde de sécurité automatique avant restauration
- ✅ Vérification d'intégrité des fichiers
- ✅ Mode interactif avec confirmation
- ✅ Mode forcé pour l'automatisation
- ✅ Gestion des connexions actives

---

### 📋 `cron_examples.txt` - Exemples de configuration Cron
**Fonction :** Contient des exemples de configuration pour automatiser les sauvegardes avec Cron.

**Configuration recommandée :**
```bash
# Sauvegarde quotidienne à 2h00
0 2 * * * /path/to/agde_moto/scripts/backup_db.sh >> /var/log/agde_moto_cron.log 2>&1

# Nettoyage hebdomadaire le dimanche à 3h00
0 3 * * 0 /path/to/agde_moto/scripts/cleanup_backups.sh >> /var/log/agde_moto_cron.log 2>&1
```

## Installation et configuration

### 1. Préparation des répertoires
```bash
# Créer le répertoire de sauvegarde
sudo mkdir -p /var/backups/agde_moto
sudo chown $USER:$USER /var/backups/agde_moto
sudo chmod 755 /var/backups/agde_moto

# Créer les fichiers de log
sudo touch /var/log/agde_moto_backup.log
sudo touch /var/log/agde_moto_cron.log
sudo chown $USER:$USER /var/log/agde_moto_*.log
```

### 2. Rendre les scripts exécutables
```bash
chmod +x scripts/*.sh
```

### 3. Configuration Cron
```bash
# Ouvrir l'éditeur crontab
crontab -e

# Ajouter les tâches (voir cron_examples.txt)
# Sauvegarder et quitter

# Vérifier l'installation
crontab -l
```

### 4. Test des scripts
```bash
# Tester la sauvegarde
./scripts/backup_db.sh

# Vérifier que la sauvegarde a été créée
ls -la /var/backups/agde_moto/

# Tester le nettoyage
./scripts/cleanup_backups.sh

# Tester la restauration (mode liste)
./scripts/restore_db.sh --list
```

## Structure des fichiers de sauvegarde

```
/var/backups/agde_moto/
├── agde_moto_backup_20240107_143000.sql.gz     # Sauvegarde quotidienne
├── agde_moto_weekly_backup_20240107_143000.sql.gz   # Sauvegarde hebdomadaire
├── agde_moto_monthly_backup_20240107_143000.sql.gz  # Sauvegarde mensuelle
└── ...
```

**Format des noms de fichiers :**
- `agde_moto_backup_YYYYMMDD_HHMMSS.sql.gz` - Sauvegardes quotidiennes
- `agde_moto_weekly_backup_YYYYMMDD_HHMMSS.sql.gz` - Sauvegardes hebdomadaires
- `agde_moto_monthly_backup_YYYYMMDD_HHMMSS.sql.gz` - Sauvegardes mensuelles

## Surveillance et monitoring

### Vérification des sauvegardes
```bash
# Voir les dernières sauvegardes
ls -lht /var/backups/agde_moto/

# Vérifier les logs
tail -f /var/log/agde_moto_backup.log

# Vérifier l'espace disque
df -h /var/backups/agde_moto/
```

### Vérification de l'intégrité
```bash
# Tester l'intégrité d'une sauvegarde compressée
gzip -t /var/backups/agde_moto/backup_file.sql.gz

# Vérifier le contenu d'une sauvegarde
zcat /var/backups/agde_moto/backup_file.sql.gz | head -20
```

## Dépannage

### Problèmes courants

#### ❌ Erreur "Conteneur non trouvé"
**Solution :**
```bash
# Vérifier que le conteneur PostgreSQL est en cours d'exécution
docker ps | grep agde_moto_db

# Si nécessaire, démarrer le conteneur
docker-compose up -d db
```

#### ❌ Espace disque insuffisant
**Solution :**
```bash
# Vérifier l'espace disponible
df -h /var/backups/agde_moto/

# Lancer le nettoyage des anciennes sauvegardes
./scripts/cleanup_backups.sh
```

#### ❌ Permissions insuffisantes
**Solution :**
```bash
# Vérifier les permissions
ls -la /var/backups/agde_moto/

# Corriger les permissions si nécessaire
sudo chown -R $USER:$USER /var/backups/agde_moto/
sudo chmod -R 755 /var/backups/agde_moto/
```

#### ❌ Sauvegarde corrompue
**Solution :**
```bash
# Vérifier l'intégrité du fichier
gzip -t backup_file.sql.gz

# Si corrompu, utiliser une sauvegarde plus ancienne
./scripts/restore_db.sh --list
./scripts/restore_db.sh older_backup.sql.gz
```

## Sécurité

### Bonnes pratiques
- 🔒 Limitez l'accès aux fichiers de sauvegarde (permissions 600 ou 755)
- 🔒 Utilisez des mots de passe forts pour la base de données
- 🔒 Considérez le chiffrement des sauvegardes pour les données sensibles
- 🔒 Stockez des copies de sauvegarde hors site
- 🔒 Testez régulièrement la procédure de restauration

### Chiffrement des sauvegardes (optionnel)
```bash
# Chiffrer une sauvegarde
gpg --symmetric --cipher-algo AES256 backup.sql.gz

# Déchiffrer une sauvegarde
gpg --decrypt backup.sql.gz.gpg > backup.sql.gz
```

## Support

Pour plus d'informations, consultez :
- 📖 [Documentation complète dans DOCKER.md](../DOCKER.md#automatisation-des-sauvegardes)
- 📧 Contact : admin@agde-moto.com

---

**Dernière mise à jour :** Janvier 2024  
**Version :** 1.0  
**Auteur :** AGDE Moto Development Team