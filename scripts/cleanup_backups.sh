#!/bin/bash

# Script de nettoyage des anciennes sauvegardes
# Auteur: AGDE Moto
# Description: Supprime les sauvegardes anciennes selon la politique de rétention

set -e  # Arrêter le script en cas d'erreur

# Configuration
BACKUP_DIR="/var/backups/agde_moto"
LOG_FILE="/var/log/agde_moto_backup.log"

# Politique de rétention (en jours)
DAILY_RETENTION=7    # Garder 7 jours de sauvegardes quotidiennes
WEEKLY_RETENTION=30  # Garder 30 jours de sauvegardes hebdomadaires
MONTHLY_RETENTION=365 # Garder 1 an de sauvegardes mensuelles

# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Vérifier que le répertoire de sauvegarde existe
if [ ! -d "$BACKUP_DIR" ]; then
    log "ERREUR: Le répertoire de sauvegarde $BACKUP_DIR n'existe pas"
    exit 1
fi

log "Début du nettoyage des anciennes sauvegardes"

# Compter les fichiers avant nettoyage
BEFORE_COUNT=$(find "$BACKUP_DIR" -name "*.sql.gz" | wc -l)
log "Nombre de sauvegardes avant nettoyage: $BEFORE_COUNT"

# Supprimer les sauvegardes quotidiennes anciennes (plus de 7 jours)
log "Suppression des sauvegardes quotidiennes de plus de $DAILY_RETENTION jours"
find "$BACKUP_DIR" -name "agde_moto_backup_*.sql.gz" -type f -mtime +$DAILY_RETENTION -delete

# Garder une sauvegarde par semaine pour les 30 derniers jours
log "Conservation d'une sauvegarde par semaine pour les $WEEKLY_RETENTION derniers jours"
for week in $(seq 1 4); do
    week_start=$((week * 7))
    week_end=$(((week + 1) * 7))
    
    # Trouver la sauvegarde la plus récente de cette semaine
    WEEKLY_BACKUP=$(find "$BACKUP_DIR" -name "agde_moto_backup_*.sql.gz" -type f -mtime +$week_start -mtime -$week_end | sort | tail -1)
    
    if [ -n "$WEEKLY_BACKUP" ]; then
        # Marquer cette sauvegarde comme hebdomadaire (renommer)
        WEEKLY_NAME=$(echo "$WEEKLY_BACKUP" | sed 's/backup_/weekly_backup_/')
        if [ "$WEEKLY_BACKUP" != "$WEEKLY_NAME" ]; then
            mv "$WEEKLY_BACKUP" "$WEEKLY_NAME"
            log "Sauvegarde hebdomadaire conservée: $(basename "$WEEKLY_NAME")"
        fi
    fi
done

# Garder une sauvegarde par mois pour l'année écoulée
log "Conservation d'une sauvegarde par mois pour les $MONTHLY_RETENTION derniers jours"
for month in $(seq 1 12); do
    month_start=$((month * 30))
    month_end=$(((month + 1) * 30))
    
    # Trouver la sauvegarde la plus récente de ce mois
    MONTHLY_BACKUP=$(find "$BACKUP_DIR" -name "agde_moto_*backup_*.sql.gz" -type f -mtime +$month_start -mtime -$month_end | sort | tail -1)
    
    if [ -n "$MONTHLY_BACKUP" ]; then
        # Marquer cette sauvegarde comme mensuelle (renommer)
        MONTHLY_NAME=$(echo "$MONTHLY_BACKUP" | sed 's/backup_/monthly_backup_/' | sed 's/weekly_backup_/monthly_backup_/')
        if [ "$MONTHLY_BACKUP" != "$MONTHLY_NAME" ]; then
            mv "$MONTHLY_BACKUP" "$MONTHLY_NAME"
            log "Sauvegarde mensuelle conservée: $(basename "$MONTHLY_NAME")"
        fi
    fi
done

# Supprimer les très anciennes sauvegardes (plus d'un an)
log "Suppression des sauvegardes de plus de $MONTHLY_RETENTION jours"
find "$BACKUP_DIR" -name "*.sql.gz" -type f -mtime +$MONTHLY_RETENTION -delete

# Compter les fichiers après nettoyage
AFTER_COUNT=$(find "$BACKUP_DIR" -name "*.sql.gz" | wc -l)
DELETED_COUNT=$((BEFORE_COUNT - AFTER_COUNT))

log "Nettoyage terminé: $DELETED_COUNT sauvegardes supprimées"
log "Nombre de sauvegardes restantes: $AFTER_COUNT"

# Afficher l'espace disque libéré
DISK_USAGE=$(df -h "$BACKUP_DIR" | tail -1 | awk '{print $5}')
log "Espace disque utilisé après nettoyage: $DISK_USAGE"

# Lister les sauvegardes restantes
log "Sauvegardes conservées:"
ls -lh "$BACKUP_DIR"/*.sql.gz 2>/dev/null | while read line; do
    log "  $line"
done

log "Nettoyage des sauvegardes terminé avec succès"

exit 0