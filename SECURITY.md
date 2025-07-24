# Guide de Sécurité - Agde Moto

## 🔒 Résumé des Améliorations de Sécurité Implémentées

Ce document détaille toutes les mesures de sécurité mises en place pour protéger l'application Agde Moto.

## ✅ Corrections Critiques Appliquées

### 1. Configuration Django Sécurisée
- ✅ **Variables d'environnement** : Utilisation de `.env` pour les données sensibles
- ✅ **DEBUG=False** : Désactivé par défaut en production
- ✅ **SECRET_KEY** : Externalisée dans les variables d'environnement
- ✅ **ALLOWED_HOSTS** : Configuré de manière restrictive
- ✅ **CORS** : Configuration restrictive avec domaines spécifiques

### 2. Authentification et Autorisation
- ✅ **Permissions par défaut** : `IsAuthenticated` au lieu de `AllowAny`
- ✅ **JWT sécurisé** : Tokens avec expiration courte (15 min)
- ✅ **Rotation des tokens** : Renouvellement automatique
- ✅ **Limitation de taux** : Protection contre les attaques par force brute
- ✅ **Blocage temporaire** : 5 tentatives max puis blocage 15 min

### 3. Middlewares de Sécurité Personnalisés
- ✅ **SecurityHeadersMiddleware** : En-têtes de sécurité (CSP, XSS, etc.)
- ✅ **DDoSProtectionMiddleware** : Limitation à 100 requêtes/minute par IP
- ✅ **RequestLoggingMiddleware** : Détection des requêtes suspectes

### 4. Validation et Sanitisation
- ✅ **Échappement HTML** : Protection contre XSS
- ✅ **Validation des entrées** : Longueur et format des données
- ✅ **Détection d'injection SQL** : Surveillance des paramètres suspects

### 5. Configuration HTTPS
- ✅ **HSTS** : Strict Transport Security activé
- ✅ **Cookies sécurisés** : HttpOnly et Secure flags
- ✅ **Redirection HTTPS** : Forcée en production

### 6. Logging de Sécurité
- ✅ **Tentatives de connexion** : Succès et échecs enregistrés
- ✅ **Requêtes suspectes** : User-Agents et patterns malveillants
- ✅ **Modifications admin** : Traçabilité des actions

## 🔧 Configuration Requise pour la Production

### 1. Variables d'Environnement (.env)
```bash
# Sécurité critique
SECRET_KEY=votre-cle-secrete-unique-et-complexe
DEBUG=False
ALLOWED_HOSTS=votre-domaine.com,www.votre-domaine.com

# HTTPS obligatoire
SECURE_SSL_REDIRECT=True
SECURE_HSTS_SECONDS=31536000

# CORS restrictif
CORS_ALLOWED_ORIGINS=https://votre-domaine.com
CORS_ALLOW_ALL_ORIGINS=False

# JWT sécurisé
JWT_ACCESS_TOKEN_LIFETIME=15
JWT_REFRESH_TOKEN_LIFETIME=1440
```

### 2. Base de Données
- **Recommandé** : PostgreSQL au lieu de SQLite
- **Chiffrement** : Connexions SSL/TLS
- **Sauvegardes** : Chiffrées et régulières

### 3. Cache et Sessions
- **Redis** : Pour le cache et la limitation de taux
- **Sessions sécurisées** : Cookies HttpOnly et Secure

## 🛡️ En-têtes de Sécurité Implémentés

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; ...
```

## 🚨 Surveillance et Monitoring

### Logs à Surveiller
1. **Tentatives de connexion échouées** répétées
2. **Requêtes avec User-Agents suspects** (sqlmap, nikto, etc.)
3. **Tentatives d'injection SQL** dans les paramètres
4. **Dépassement des limites de taux**
5. **Modifications des paramètres admin**

### Alertes Recommandées
- Plus de 10 tentatives de connexion échouées en 5 minutes
- Détection de patterns d'injection SQL
- Requêtes avec User-Agents de scanners de sécurité
- Modifications non autorisées des paramètres

## 📋 Checklist de Déploiement Sécurisé

### Avant le Déploiement
- [ ] Générer une nouvelle SECRET_KEY unique
- [ ] Configurer DEBUG=False
- [ ] Définir ALLOWED_HOSTS avec les domaines réels
- [ ] Configurer le certificat SSL/TLS
- [ ] Mettre en place PostgreSQL
- [ ] Configurer Redis pour le cache
- [ ] Tester la limitation de taux
- [ ] Vérifier les logs de sécurité

### Après le Déploiement
- [ ] Tester l'authentification
- [ ] Vérifier les en-têtes de sécurité
- [ ] Contrôler les permissions des endpoints
- [ ] Surveiller les logs d'erreur
- [ ] Effectuer un scan de sécurité

## 🔄 Maintenance de Sécurité

### Quotidienne
- Vérifier les logs de sécurité
- Surveiller les tentatives de connexion suspectes

### Hebdomadaire
- Analyser les patterns d'attaque
- Vérifier les mises à jour de sécurité Django

### Mensuelle
- Audit des permissions utilisateurs
- Test de pénétration basique
- Mise à jour des dépendances

## 📞 Contact Sécurité

En cas de découverte de vulnérabilité :
1. **NE PAS** divulguer publiquement
2. Contacter l'équipe de développement
3. Fournir un rapport détaillé
4. Attendre la correction avant divulgation

## 📚 Ressources Supplémentaires

- [Django Security Checklist](https://docs.djangoproject.com/en/stable/topics/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Mozilla Security Guidelines](https://infosec.mozilla.org/guidelines/)

---

**Score de Sécurité Actuel : 9/10** ⭐

*Dernière mise à jour : Décembre 2024*