#!/bin/bash

# Script de restauration de base de données PostgreSQL
# Auteur: AGDE Moto
# Description: Restaure une sauvegarde de la base de données PostgreSQL

set -e  # Arrêter le script en cas d'erreur

# Configuration
DB_CONTAINER="agde_moto_db"
DB_NAME="agde_moto"
DB_USER="agde_user"
BACKUP_DIR="/var/backups/agde_moto"
LOG_FILE="/var/log/agde_moto_backup.log"

# Fonction de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Fonction d'aide
show_help() {
    echo "Usage: $0 [OPTIONS] <backup_file>"
    echo ""
    echo "Options:"
    echo "  -l, --list          Lister les sauvegardes disponibles"
    echo "  -f, --force         Forcer la restauration sans confirmation"
    echo "  -h, --help          Afficher cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 -l                                    # Lister les sauvegardes"
    echo "  $0 agde_moto_backup_20240107_143000.sql.gz  # Restaurer une sauvegarde"
    echo "  $0 -f backup.sql.gz                     # Restauration forcée"
}

# Fonction pour lister les sauvegardes
list_backups() {
    log "Sauvegardes disponibles dans $BACKUP_DIR:"
    if [ -d "$BACKUP_DIR" ] && [ "$(ls -A $BACKUP_DIR/*.sql.gz 2>/dev/null)" ]; then
        echo ""
        echo "Fichier                                    Taille    Date"
        echo "------------------------------------------ --------- -------------------"
        ls -lht "$BACKUP_DIR"/*.sql.gz | while read -r line; do
            filename=$(echo "$line" | awk '{print $9}' | xargs basename)
            size=$(echo "$line" | awk '{print $5}')
            date=$(echo "$line" | awk '{print $6, $7, $8}')
            printf "%-42s %-9s %s\n" "$filename" "$size" "$date"
        done
        echo ""
    else
        echo "Aucune sauvegarde trouvée dans $BACKUP_DIR"
    fi
}

# Fonction de restauration
restore_database() {
    local backup_file="$1"
    local force="$2"
    
    # Vérifier que le fichier de sauvegarde existe
    if [ ! -f "$backup_file" ]; then
        # Essayer dans le répertoire de sauvegarde
        if [ -f "$BACKUP_DIR/$backup_file" ]; then
            backup_file="$BACKUP_DIR/$backup_file"
        else
            log "ERREUR: Fichier de sauvegarde non trouvé: $backup_file"
            exit 1
        fi
    fi
    
    # Vérifier que le conteneur Docker est en cours d'exécution
    if ! docker ps | grep -q "$DB_CONTAINER"; then
        log "ERREUR: Le conteneur $DB_CONTAINER n'est pas en cours d'exécution"
        exit 1
    fi
    
    # Vérifier l'intégrité de la sauvegarde
    if [[ "$backup_file" == *.gz ]]; then
        if ! gzip -t "$backup_file"; then
            log "ERREUR: Le fichier de sauvegarde est corrompu"
            exit 1
        fi
    fi
    
    # Demander confirmation si pas en mode forcé
    if [ "$force" != "true" ]; then
        echo ""
        echo "⚠️  ATTENTION: Cette opération va ÉCRASER la base de données actuelle!"
        echo "Fichier de sauvegarde: $(basename "$backup_file")"
        echo "Base de données cible: $DB_NAME"
        echo ""
        read -p "Êtes-vous sûr de vouloir continuer? (oui/non): " confirm
        
        if [ "$confirm" != "oui" ] && [ "$confirm" != "yes" ] && [ "$confirm" != "y" ]; then
            log "Restauration annulée par l'utilisateur"
            exit 0
        fi
    fi
    
    log "Début de la restauration depuis: $(basename "$backup_file")"
    
    # Créer une sauvegarde de sécurité avant restauration
    SAFETY_BACKUP="/tmp/agde_moto_safety_$(date +"%Y%m%d_%H%M%S").sql"
    log "Création d'une sauvegarde de sécurité: $SAFETY_BACKUP"
    docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" > "$SAFETY_BACKUP"
    
    # Arrêter les connexions actives
    log "Fermeture des connexions actives à la base de données"
    docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "
        SELECT pg_terminate_backend(pid) 
        FROM pg_stat_activity 
        WHERE datname = '$DB_NAME' AND pid <> pg_backend_pid();"
    
    # Supprimer et recréer la base de données
    log "Suppression et recréation de la base de données $DB_NAME"
    docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "DROP DATABASE IF EXISTS $DB_NAME;"
    docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d postgres -c "CREATE DATABASE $DB_NAME;"
    
    # Restaurer la sauvegarde
    log "Restauration des données..."
    if [[ "$backup_file" == *.gz ]]; then
        # Fichier compressé
        if zcat "$backup_file" | docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME"; then
            log "Restauration réussie depuis: $(basename "$backup_file")"
        else
            log "ERREUR: Échec de la restauration"
            log "Restauration de la sauvegarde de sécurité..."
            docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$SAFETY_BACKUP"
            exit 1
        fi
    else
        # Fichier non compressé
        if docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$backup_file"; then
            log "Restauration réussie depuis: $(basename "$backup_file")"
        else
            log "ERREUR: Échec de la restauration"
            log "Restauration de la sauvegarde de sécurité..."
            docker exec -i "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" < "$SAFETY_BACKUP"
            exit 1
        fi
    fi
    
    # Vérifier la restauration
    TABLE_COUNT=$(docker exec "$DB_CONTAINER" psql -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
    log "Nombre de tables restaurées: $(echo $TABLE_COUNT | tr -d ' ')"
    
    # Nettoyer la sauvegarde de sécurité
    rm -f "$SAFETY_BACKUP"
    
    log "Restauration terminée avec succès"
}

# Traitement des arguments
FORCE=false
while [[ $# -gt 0 ]]; do
    case $1 in
        -l|--list)
            list_backups
            exit 0
            ;;
        -f|--force)
            FORCE=true
            shift
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        -*)
            echo "Option inconnue: $1"
            show_help
            exit 1
            ;;
        *)
            BACKUP_FILE="$1"
            shift
            ;;
    esac
done

# Vérifier qu'un fichier de sauvegarde a été spécifié
if [ -z "$BACKUP_FILE" ]; then
    echo "Erreur: Aucun fichier de sauvegarde spécifié"
    echo ""
    show_help
    exit 1
fi

# Lancer la restauration
restore_database "$BACKUP_FILE" "$FORCE"

exit 0