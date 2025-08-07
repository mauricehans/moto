#!/bin/bash

# Script de sauvegarde automatisée pour PostgreSQL Docker
# Auteur: AGDE Moto
# Description: Crée une sauvegarde horodatée de la base de données PostgreSQL

set -e  # Arrêter le script en cas d'erreur

# Configuration
DB_CONTAINER="agde_moto_db"
DB_NAME="agde_moto"
DB_USER="agde_user"
BACKUP_DIR="/var/backups/agde_moto"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="agde_moto_backup_${TIMESTAMP}.sql"
LOG_FILE="/var/log/agde_moto_backup.log"

# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Créer le répertoire de sauvegarde s'il n'existe pas
if [ ! -d "$BACKUP_DIR" ]; then
    log "Création du répertoire de sauvegarde: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
fi

# Vérifier que le conteneur Docker est en cours d'exécution
if ! docker ps | grep -q "$DB_CONTAINER"; then
    log "ERREUR: Le conteneur $DB_CONTAINER n'est pas en cours d'exécution"
    exit 1
fi

log "Début de la sauvegarde de la base de données $DB_NAME"

# Créer la sauvegarde
if docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$BACKUP_DIR/$BACKUP_FILE"; then
    # Compresser la sauvegarde
    gzip "$BACKUP_DIR/$BACKUP_FILE"
    BACKUP_FILE="${BACKUP_FILE}.gz"
    
    # Calculer la taille du fichier
    BACKUP_SIZE=$(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)
    
    log "Sauvegarde réussie: $BACKUP_FILE (Taille: $BACKUP_SIZE)"
    
    # Vérifier l'intégrité de la sauvegarde
    if gzip -t "$BACKUP_DIR/$BACKUP_FILE"; then
        log "Vérification d'intégrité: OK"
    else
        log "ERREUR: La sauvegarde est corrompue"
        exit 1
    fi
    
    # Afficher l'espace disque restant
    DISK_USAGE=$(df -h "$BACKUP_DIR" | tail -1 | awk '{print $5}')
    log "Espace disque utilisé: $DISK_USAGE"
    
else
    log "ERREUR: Échec de la sauvegarde"
    exit 1
fi

log "Sauvegarde terminée avec succès"

# Optionnel: Envoyer une notification (décommentez si nécessaire)
# echo "Sauvegarde AGDE Moto réussie: $BACKUP_FILE" | mail -s "Sauvegarde DB" admin@agdemoto.com

exit 0