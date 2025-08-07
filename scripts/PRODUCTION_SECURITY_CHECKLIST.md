# 🚨 Checklist de Sécurité - Mise en Production AGDE Moto

> **CRITIQUE :** Cette checklist DOIT être complètement validée avant toute mise en production.
> Chaque élément doit être vérifié et coché ✅ avant de passer au suivant.

---

## 📋 Phase 1 : Génération des Secrets (OBLIGATOIRE)

### Génération des clés et mots de passe
- [ ] **Script de génération exécuté**
  ```bash
  cd scripts
  python generate_secrets.py
  ```
  - [ ] SECRET_KEY Django générée (50+ caractères)
  - [ ] Mot de passe base de données généré (32+ caractères)
  - [ ] Clé JWT générée (64+ caractères)
  - [ ] Mot de passe Redis généré (32+ caractères)

### Sauvegarde sécurisée des secrets
- [ ] **Fichier .env créé** avec les nouvelles valeurs
- [ ] **Secrets sauvegardés** dans un gestionnaire de mots de passe
- [ ] **Fichiers temporaires supprimés** (ex: .env.production.YYYYMMDD_HHMMSS)
- [ ] **Permissions fichier .env** définies à 600 (lecture/écriture propriétaire uniquement)
  ```bash
  chmod 600 backend/.env
  ```

---

## 🔧 Phase 2 : Configuration Django

### Variables d'environnement critiques
- [ ] **SECRET_KEY** : Remplacée par la valeur générée
- [ ] **DEBUG=False** : Confirmé en production
- [ ] **ALLOWED_HOSTS** : Configuré avec les domaines réels uniquement
  - [ ] Suppression de `localhost` et `127.0.0.1`
  - [ ] Ajout du/des domaine(s) de production
- [ ] **CORS_ALLOWED_ORIGINS** : Limité aux domaines autorisés
  - [ ] Suppression des URLs de développement
  - [ ] Ajout des URLs de production uniquement

### Configuration HTTPS
- [ ] **Certificat SSL** installé et valide
- [ ] **SECURE_SSL_REDIRECT=True** : Redirection HTTPS forcée
- [ ] **SECURE_HSTS_SECONDS=31536000** : HSTS configuré (1 an)
- [ ] **SECURE_HSTS_INCLUDE_SUBDOMAINS=True** : Sous-domaines inclus
- [ ] **SECURE_HSTS_PRELOAD=True** : Préchargement HSTS activé

### Sécurité des cookies et sessions
- [ ] **SESSION_COOKIE_SECURE=True** : Cookies sécurisés
- [ ] **SESSION_COOKIE_HTTPONLY=True** : Protection XSS
- [ ] **SESSION_COOKIE_SAMESITE=Strict** : Protection CSRF
- [ ] **CSRF_COOKIE_SECURE=True** : Token CSRF sécurisé
- [ ] **CSRF_COOKIE_HTTPONLY=True** : Token CSRF protégé

### Tests de validation Django
- [ ] **Test de déploiement** exécuté sans erreur
  ```bash
  python manage.py check --deploy
  ```
- [ ] **Test de sécurité** exécuté sans erreur
  ```bash
  python manage.py check --tag security
  ```
- [ ] **Collecte des fichiers statiques** réussie
  ```bash
  python manage.py collectstatic --noinput
  ```

---

## 🗄️ Phase 3 : Sécurisation Base de Données

### Configuration PostgreSQL
- [ ] **Utilisateur dédié** créé avec privilèges limités
  ```sql
  CREATE USER agde_moto_user WITH PASSWORD 'MOT_DE_PASSE_SECURISE';
  CREATE DATABASE agde_moto OWNER agde_moto_user;
  ```
- [ ] **Mot de passe par défaut** changé (postgres, etc.)
- [ ] **pg_hba.conf** configuré pour authentification md5
- [ ] **postgresql.conf** sécurisé :
  - [ ] `listen_addresses = 'localhost'`
  - [ ] `log_connections = on`
  - [ ] `log_failed_connections = on`

### Tests de connexion
- [ ] **Connexion application** testée avec nouveaux identifiants
- [ ] **Migrations** appliquées avec succès
  ```bash
  python manage.py migrate
  ```
- [ ] **Superutilisateur** créé pour l'administration
  ```bash
  python manage.py createsuperuser
  ```

---

## 📦 Phase 4 : Configuration Redis

### Sécurisation Redis
- [ ] **Mot de passe Redis** configuré dans redis.conf
  ```
  requirepass MOT_DE_PASSE_REDIS_SECURISE
  ```
- [ ] **Liaison réseau** limitée à localhost
  ```
  bind 127.0.0.1
  ```
- [ ] **Commandes dangereuses** désactivées
  ```
  rename-command FLUSHDB ""
  rename-command FLUSHALL ""
  rename-command KEYS ""
  ```

### Tests Redis
- [ ] **Connexion avec mot de passe** testée
  ```bash
  redis-cli -a MOT_DE_PASSE_REDIS ping
  ```
- [ ] **URL Redis** mise à jour dans .env
  ```
  REDIS_URL=redis://:MOT_DE_PASSE@127.0.0.1:6379/1
  ```

---

## 🐳 Phase 5 : Configuration Docker

### Sécurisation des conteneurs
- [ ] **Images de base** mises à jour vers les dernières versions
- [ ] **Utilisateur non-root** configuré dans les Dockerfiles
- [ ] **Secrets Docker** utilisés pour les mots de passe sensibles
- [ ] **Variables d'environnement** sécurisées (pas de secrets en dur)

### Configuration docker-compose
- [ ] **Réseaux isolés** configurés
- [ ] **Volumes persistants** sécurisés
- [ ] **Ports exposés** limités au strict nécessaire
- [ ] **Restart policies** configurées (unless-stopped)

### Tests Docker
- [ ] **Build des images** réussi sans erreur
  ```bash
  docker-compose build
  ```
- [ ] **Démarrage des services** réussi
  ```bash
  docker-compose up -d
  ```
- [ ] **Logs des conteneurs** vérifiés (pas d'erreurs)
  ```bash
  docker-compose logs
  ```

---

## 🌐 Phase 6 : Configuration Serveur Web

### Configuration Nginx/Apache
- [ ] **Certificat SSL** installé et configuré
- [ ] **Redirection HTTP vers HTTPS** activée
- [ ] **Headers de sécurité** configurés :
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-XSS-Protection: 1; mode=block`
  - [ ] `Strict-Transport-Security`
- [ ] **Rate limiting** configuré
- [ ] **Gzip/Brotli** activé pour les performances

### Tests serveur web
- [ ] **HTTPS** fonctionne correctement
- [ ] **Redirection HTTP** vers HTTPS active
- [ ] **Headers de sécurité** présents (vérification avec curl)
  ```bash
  curl -I https://votre-domaine.com
  ```

---

## 🔍 Phase 7 : Tests de Sécurité

### Tests automatisés
- [ ] **SSL Labs Test** : Grade A ou A+
  - URL : https://www.ssllabs.com/ssltest/
- [ ] **Security Headers** : Grade A
  - URL : https://securityheaders.com/
- [ ] **Mozilla Observatory** : Grade A ou A+
  - URL : https://observatory.mozilla.org/

### Tests manuels
- [ ] **Tentative d'accès HTTP** redirigée vers HTTPS
- [ ] **Page d'administration** accessible uniquement en HTTPS
- [ ] **Formulaires** protégés par CSRF
- [ ] **Upload de fichiers** limité en taille et type
- [ ] **Erreurs 500** ne révèlent pas d'informations sensibles

### Tests de pénétration basiques
- [ ] **Scan de ports** (nmap) - seuls les ports nécessaires ouverts
- [ ] **Test d'injection SQL** - protection active
- [ ] **Test XSS** - protection active
- [ ] **Test de force brute** - rate limiting actif

---

## 📊 Phase 8 : Monitoring et Logging

### Configuration des logs
- [ ] **Logs d'accès** configurés et rotationnés
- [ ] **Logs d'erreur** configurés avec niveau approprié
- [ ] **Logs de sécurité** activés (tentatives de connexion, etc.)
- [ ] **Rotation des logs** configurée (logrotate)

### Monitoring
- [ ] **Monitoring système** configuré (CPU, RAM, disque)
- [ ] **Monitoring application** configuré (temps de réponse, erreurs)
- [ ] **Alertes** configurées pour les événements critiques
- [ ] **Sauvegarde des logs** configurée

---

## 💾 Phase 9 : Sauvegardes

### Configuration des sauvegardes
- [ ] **Sauvegarde base de données** automatisée
  ```bash
  # Test du script de sauvegarde
  ./scripts/backup_db.sh
  ```
- [ ] **Sauvegarde fichiers statiques** configurée
- [ ] **Sauvegarde configuration** (.env, nginx.conf, etc.)
- [ ] **Rotation des sauvegardes** configurée (7 jours minimum)

### Tests de restauration
- [ ] **Test de restauration BD** réussi sur environnement de test
- [ ] **Test de restauration fichiers** réussi
- [ ] **Documentation de restauration** à jour

---

## 🚨 Phase 10 : Plan d'Incident

### Préparation
- [ ] **Contacts d'urgence** définis et documentés
- [ ] **Procédures d'incident** documentées
- [ ] **Rollback plan** préparé et testé
- [ ] **Communication de crise** planifiée

### Outils d'urgence
- [ ] **Accès d'urgence** au serveur configuré
- [ ] **Scripts de maintenance** préparés
- [ ] **Monitoring d'urgence** configuré
- [ ] **Contacts techniques** disponibles 24/7

---

## ✅ Phase 11 : Validation Finale

### Tests fonctionnels complets
- [ ] **Navigation complète** du site testée
- [ ] **Formulaires** testés (contact, admin, etc.)
- [ ] **Upload d'images** testé
- [ ] **API endpoints** testés
- [ ] **Authentification admin** testée

### Performance
- [ ] **Temps de chargement** < 3 secondes
- [ ] **Test de charge** basique réussi
- [ ] **Optimisation images** vérifiée
- [ ] **Cache** fonctionnel

### Documentation
- [ ] **Documentation technique** mise à jour
- [ ] **Procédures de maintenance** documentées
- [ ] **Contacts et responsabilités** définis
- [ ] **Planning de maintenance** établi

---

## 📅 Post-Production : Maintenance Continue

### Tâches hebdomadaires
- [ ] **Vérification des logs** de sécurité
- [ ] **Monitoring des performances**
- [ ] **Vérification des sauvegardes**
- [ ] **Scan de sécurité** automatisé

### Tâches mensuelles
- [ ] **Mise à jour des dépendances**
- [ ] **Test de restauration** des sauvegardes
- [ ] **Audit des accès** et permissions
- [ ] **Revue des logs** d'erreur

### Tâches trimestrielles
- [ ] **Rotation des mots de passe** (90 jours)
- [ ] **Audit de sécurité** complet
- [ ] **Test de pénétration** professionnel
- [ ] **Mise à jour du plan d'incident**

---

## 📞 Contacts d'Urgence

| Rôle | Contact | Téléphone | Email |
|------|---------|-----------|-------|
| Administrateur Système | [NOM] | [TÉLÉPHONE] | [EMAIL] |
| Développeur Principal | [NOM] | [TÉLÉPHONE] | [EMAIL] |
| Responsable Sécurité | [NOM] | [TÉLÉPHONE] | [EMAIL] |
| Hébergeur/Cloud | [SUPPORT] | [TÉLÉPHONE] | [EMAIL] |

---

## 📝 Validation et Signatures

**Cette checklist a été complètement validée le :** `[DATE]`

**Validé par :**
- **Développeur :** [NOM] - [SIGNATURE] - [DATE]
- **Administrateur Système :** [NOM] - [SIGNATURE] - [DATE]
- **Responsable Projet :** [NOM] - [SIGNATURE] - [DATE]

**Prochaine révision prévue le :** `[DATE + 3 MOIS]`

---

> ⚠️ **IMPORTANT :** Cette checklist doit être conservée et mise à jour régulièrement.
> En cas de doute sur un point, consultez le guide détaillé dans `SECURITY_GUIDE.md`.

*Version : 1.0*  
*Dernière mise à jour : $(date +'%Y-%m-%d')*