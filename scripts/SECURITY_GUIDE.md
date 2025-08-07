# 🔐 Guide de Sécurité - AGDE Moto

## Table des matières
1. [Génération de mots de passe robustes](#génération-de-mots-de-passe-robustes)
2. [Configuration de la base de données](#configuration-de-la-base-de-données)
3. [Sécurisation de Django](#sécurisation-de-django)
4. [Configuration Redis](#configuration-redis)
5. [Bonnes pratiques générales](#bonnes-pratiques-générales)

---

## Génération de mots de passe robustes

### 🎯 Critères d'un mot de passe sécurisé

**Pour la base de données PostgreSQL :**
- **Longueur minimale :** 32 caractères
- **Complexité :** Mélange de majuscules, minuscules, chiffres et symboles
- **Éviter :** Mots du dictionnaire, informations personnelles, patterns répétitifs
- **Unicité :** Chaque service doit avoir son propre mot de passe

### 🛠️ Méthodes de génération

#### Option 1 : Script Python fourni
```bash
cd scripts
python generate_secrets.py
```

#### Option 2 : OpenSSL (Linux/macOS)
```bash
# Mot de passe de 32 caractères
openssl rand -base64 32

# Mot de passe de 48 caractères (plus sécurisé)
openssl rand -base64 48
```

#### Option 3 : PowerShell (Windows)
```powershell
# Génération d'un mot de passe de 32 caractères
-join ((65..90) + (97..122) + (48..57) + (33,35,36,37,38,42,43,45,61,63,64) | Get-Random -Count 32 | % {[char]$_})
```

#### Option 4 : Gestionnaires de mots de passe
- **Bitwarden** (recommandé)
- **1Password**
- **KeePass**
- **LastPass**

### 📋 Template de mots de passe par service

```bash
# Base de données PostgreSQL
DB_PASSWORD=Kj9#mN2$pQ8@vR5&wX7*zA3!bC6%dE1^

# Redis
REDIS_PASSWORD=Lm4@nP7$qS9&tU2*vW5#xY8!zA1%bD6^

# JWT Secret
JWT_SECRET_KEY=Np6@oQ9$rT2&uV5*wX8#yZ1!aB4%cE7^

# Django Secret Key
SECRET_KEY=Qr8@sU1$tV4&wY7*xZ0#aB3!cD6%eF9^
```

---

## Configuration de la base de données

### 🐘 PostgreSQL - Configuration sécurisée

#### 1. Création de l'utilisateur
```sql
-- Se connecter en tant que superutilisateur
psql -U postgres

-- Créer un utilisateur dédié avec des privilèges limités
CREATE USER agde_moto_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE_SECURISE';

-- Créer la base de données
CREATE DATABASE agde_moto OWNER agde_moto_user;

-- Accorder uniquement les privilèges nécessaires
GRANT CONNECT ON DATABASE agde_moto TO agde_moto_user;
GRANT USAGE ON SCHEMA public TO agde_moto_user;
GRANT CREATE ON SCHEMA public TO agde_moto_user;
```

#### 2. Configuration pg_hba.conf
```bash
# Localiser le fichier
sudo find /etc -name "pg_hba.conf" 2>/dev/null

# Éditer le fichier
sudo nano /etc/postgresql/*/main/pg_hba.conf
```

**Configuration recommandée :**
```
# TYPE  DATABASE        USER            ADDRESS                 METHOD
local   all             postgres                                peer
local   agde_moto       agde_moto_user                          md5
host    agde_moto       agde_moto_user  127.0.0.1/32            md5
host    agde_moto       agde_moto_user  ::1/128                 md5
```

#### 3. Configuration postgresql.conf
```bash
# Sécurisation des connexions
listen_addresses = 'localhost'
port = 5432
max_connections = 100

# Logging pour la sécurité
log_connections = on
log_disconnections = on
log_failed_connections = on
log_statement = 'mod'

# SSL (recommandé)
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

### 🔄 Rotation des mots de passe

**Fréquence recommandée :**
- **Production :** Tous les 90 jours
- **Développement :** Tous les 6 mois
- **En cas de compromission :** Immédiatement

**Script de rotation :**
```bash
#!/bin/bash
# rotate_db_password.sh

NEW_PASSWORD=$(openssl rand -base64 32)
echo "Nouveau mot de passe généré"

# Mettre à jour PostgreSQL
psql -U postgres -c "ALTER USER agde_moto_user PASSWORD '$NEW_PASSWORD';"

# Mettre à jour le fichier .env
sed -i "s/DB_PASSWORD=.*/DB_PASSWORD=$NEW_PASSWORD/" .env

# Redémarrer l'application
docker-compose restart backend

echo "Rotation du mot de passe terminée"
```

---

## Sécurisation de Django

### 🔑 SECRET_KEY

**Caractéristiques requises :**
- **Longueur :** 50+ caractères
- **Entropie élevée :** Caractères aléatoires
- **Unicité :** Différente pour chaque environnement

**Génération sécurisée :**
```python
from django.core.management.utils import get_random_secret_key
print(get_random_secret_key())
```

### 🛡️ Configuration de sécurité Django

**settings.py - Configuration production :**
```python
# Sécurité HTTPS
SECURE_SSL_REDIRECT = True
SECURE_HSTS_SECONDS = 31536000  # 1 an
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Protection des cookies
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Strict'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

# Headers de sécurité
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Autres paramètres
DEBUG = False
ALLOWED_HOSTS = ['votre-domaine.com']
```

---

## Configuration Redis

### 🔐 Sécurisation Redis

**redis.conf - Configuration sécurisée :**
```bash
# Authentification
requirepass VOTRE_MOT_DE_PASSE_REDIS_SECURISE

# Liaison réseau
bind 127.0.0.1
port 6379

# Désactiver les commandes dangereuses
rename-command FLUSHDB ""
rename-command FLUSHALL ""
rename-command KEYS ""
rename-command CONFIG "CONFIG_b835b8c3f1f3"

# Logging
loglevel notice
logfile /var/log/redis/redis-server.log
```

**URL de connexion sécurisée :**
```bash
REDIS_URL=redis://:VOTRE_MOT_DE_PASSE@127.0.0.1:6379/1
```

---

## Bonnes pratiques générales

### ✅ Checklist de sécurité

#### Avant la mise en production
- [ ] Tous les mots de passe par défaut ont été changés
- [ ] SECRET_KEY Django unique et complexe
- [ ] DEBUG=False en production
- [ ] HTTPS configuré et forcé
- [ ] Base de données avec utilisateur dédié
- [ ] Redis protégé par mot de passe
- [ ] CORS configuré de manière restrictive
- [ ] Logs de sécurité activés
- [ ] Sauvegardes automatisées configurées
- [ ] Monitoring de sécurité en place

#### Maintenance continue
- [ ] Rotation des mots de passe tous les 90 jours
- [ ] Mise à jour des dépendances mensuellement
- [ ] Audit des logs de sécurité hebdomadairement
- [ ] Test des sauvegardes mensuellement
- [ ] Scan de vulnérabilités trimestriellement

### 🚨 En cas de compromission

1. **Isolation immédiate**
   ```bash
   # Arrêter l'application
   docker-compose down
   
   # Bloquer l'accès réseau si nécessaire
   sudo ufw deny from ADRESSE_IP_SUSPECTE
   ```

2. **Changement des secrets**
   ```bash
   # Générer de nouveaux secrets
   python scripts/generate_secrets.py
   
   # Mettre à jour la configuration
   # Redéployer l'application
   ```

3. **Audit et investigation**
   - Analyser les logs d'accès
   - Vérifier l'intégrité des données
   - Documenter l'incident
   - Notifier les parties prenantes

### 📊 Monitoring de sécurité

**Métriques à surveiller :**
- Tentatives de connexion échouées
- Requêtes suspectes (SQL injection, XSS)
- Utilisation anormale des ressources
- Accès aux endpoints sensibles
- Erreurs d'authentification

**Outils recommandés :**
- **Fail2ban** : Protection contre les attaques par force brute
- **OSSEC** : Détection d'intrusion
- **Logwatch** : Analyse des logs
- **Nagios/Zabbix** : Monitoring système

---

## 📞 Support et ressources

- **Documentation Django Security :** https://docs.djangoproject.com/en/stable/topics/security/
- **OWASP Top 10 :** https://owasp.org/www-project-top-ten/
- **PostgreSQL Security :** https://www.postgresql.org/docs/current/security.html
- **Redis Security :** https://redis.io/topics/security

---

*Dernière mise à jour : $(date +'%Y-%m-%d')*
*Version : 1.0*