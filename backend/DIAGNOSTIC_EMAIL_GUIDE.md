# Guide de Diagnostic Email - Agde Moto

## 🎯 Objectif

Ce guide vous aide à diagnostiquer et résoudre les problèmes d'envoi d'email dans l'application Agde Moto, notamment pour la fonctionnalité de réinitialisation de mot de passe.

## 🔧 Outils de Diagnostic Disponibles

### 1. Page de Diagnostic Admin (Interface Web)

**URL d'accès :** `http://localhost:8000/admin/diagnostic/`

**Fonctionnalités :**
- ✅ Affichage de la configuration email actuelle
- ✅ Test de connexion SMTP en temps réel
- ✅ Test d'envoi d'email complet
- ✅ Interface utilisateur intuitive
- ✅ Résultats détaillés avec codes d'erreur

**Comment utiliser :**
1. Connectez-vous en tant qu'administrateur
2. Accédez à `/admin/diagnostic/`
3. Cliquez sur "Actualiser la configuration" pour voir les paramètres actuels
4. Utilisez "Test Connexion SMTP" pour vérifier la connectivité
5. Utilisez "Test Complet" avec votre email pour tester l'envoi

### 2. Script de Test Manuel

**Fichier :** `test_email_config.py`

**Utilisation :**
```bash
# Depuis le conteneur backend
docker-compose exec backend python test_email_config.py

# Ou depuis l'hôte
python backend/test_email_config.py
```

**Fonctionnalités :**
- Diagnostic complet de la configuration
- Test de connexion SMTP
- Test d'envoi d'email
- Rapport détaillé avec recommandations

### 3. API de Diagnostic

**Endpoint :** `GET/POST /admin/email-diagnostic/`

**Utilisation programmatique :**
```bash
# Récupérer la configuration
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/admin/email-diagnostic/

# Tester la connectivité
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"test_type":"connection"}' \
     http://localhost:8000/admin/email-diagnostic/

# Test complet avec envoi
curl -X POST -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"test_type":"full","email":"test@example.com"}' \
     http://localhost:8000/admin/email-diagnostic/
```

## 📋 Logging Amélioré

### Nouveaux Logs Disponibles

**1. Logs de Configuration (settings.py)**
```
[SETTINGS] INFO: Chargement des variables d'environnement...
[SETTINGS] INFO: EMAIL_BACKEND: ✓ (smtp)
[SETTINGS] INFO: EMAIL_HOST: ✓ (smtp.gmail.com)
[SETTINGS] WARNING: Configuration Gmail détectée - vérifiez les paramètres
```

**2. Logs de Réinitialisation de Mot de Passe (password_reset.py)**
```
[EMAIL] INFO: Tentative de réinitialisation pour: user@example.com
[EMAIL] INFO: Token généré avec succès pour l'utilisateur ID: 1
[EMAIL] INFO: URL de réinitialisation construite: http://localhost:3000/reset/...
[EMAIL] INFO: Configuration email - FROM: noreply@agdemoto.com, HOST: smtp.gmail.com
[EMAIL] INFO: Test de connexion SMTP réussi
[EMAIL] INFO: Email envoyé avec succès à: user@example.com
```

**3. Logs d'Erreur Détaillés**
```
[EMAIL] ERROR: Erreur d'authentification SMTP: (535, 'Authentication failed')
[EMAIL] ERROR: Erreur de connexion SMTP: [Errno 111] Connection refused
[EMAIL] ERROR: Destinataire refusé: {'user@example.com': (550, 'User unknown')}
```

### Consultation des Logs

```bash
# Logs en temps réel
docker-compose logs -f backend

# Logs des 100 dernières lignes
docker-compose logs backend --tail=100

# Filtrer les logs email uniquement
docker-compose logs backend | grep "\[EMAIL\]"

# Filtrer les logs de configuration
docker-compose logs backend | grep "\[SETTINGS\]"
```

## 🚨 Résolution des Problèmes Courants

### Erreur : "Erreur lors de l'envoi de l'email"

**Étapes de diagnostic :**

1. **Vérifiez la configuration**
   ```bash
   # Accédez à la page de diagnostic
   http://localhost:8000/admin/diagnostic/
   ```

2. **Consultez les logs détaillés**
   ```bash
   docker-compose logs backend | grep "\[EMAIL\]" | tail -20
   ```

3. **Testez la connexion SMTP**
   - Utilisez la page de diagnostic pour tester la connexion
   - Vérifiez les paramètres SMTP dans le `.env`

### Erreurs Spécifiques et Solutions

**1. Erreur d'Authentification (535)**
```
[EMAIL] ERROR: Erreur d'authentification SMTP: (535, 'Authentication failed')
```
**Solutions :**
- Vérifiez `EMAIL_HOST_USER` et `EMAIL_HOST_PASSWORD`
- Pour Gmail : utilisez un mot de passe d'application
- Activez l'authentification à deux facteurs sur Gmail

**2. Erreur de Connexion (Connection refused)**
```
[EMAIL] ERROR: Erreur de connexion SMTP: [Errno 111] Connection refused
```
**Solutions :**
- Vérifiez `EMAIL_HOST` et `EMAIL_PORT`
- Vérifiez la connectivité réseau
- Testez avec `telnet smtp.gmail.com 587`

**3. Destinataire Refusé (550)**
```
[EMAIL] ERROR: Destinataire refusé: {'user@example.com': (550, 'User unknown')}
```
**Solutions :**
- Vérifiez l'adresse email du destinataire
- Vérifiez `DEFAULT_FROM_EMAIL`
- Assurez-vous que le domaine expéditeur est autorisé

**4. Backend Console Activé**
```
[SETTINGS] WARNING: Backend console activé - les emails ne seront pas envoyés
```
**Solution :**
- Changez `EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend` dans `.env`
- Redémarrez le backend : `docker-compose restart backend`

## 📧 Configuration Gmail Recommandée

### Variables d'Environnement (.env)
```env
# Configuration Email - Gmail
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-application
DEFAULT_FROM_EMAIL=noreply@agdemoto.com
```

### Configuration du Mot de Passe d'Application Gmail

1. Activez l'authentification à deux facteurs sur votre compte Gmail
2. Allez dans "Gérer votre compte Google" > "Sécurité"
3. Sous "Se connecter à Google", sélectionnez "Mots de passe des applications"
4. Générez un nouveau mot de passe d'application
5. Utilisez ce mot de passe dans `EMAIL_HOST_PASSWORD`

## 🔄 Workflow de Débogage Recommandé

1. **Vérification Initiale**
   - Consultez les logs : `docker-compose logs backend | grep "\[EMAIL\]"`
   - Accédez à la page de diagnostic : `http://localhost:8000/admin/diagnostic/`

2. **Test de Configuration**
   - Cliquez sur "Actualiser la configuration"
   - Vérifiez les avertissements affichés

3. **Test de Connectivité**
   - Utilisez "Test Connexion SMTP"
   - Analysez les erreurs spécifiques

4. **Test d'Envoi**
   - Utilisez "Test Complet" avec votre email
   - Vérifiez la réception de l'email

5. **Correction et Re-test**
   - Modifiez la configuration dans `.env`
   - Redémarrez : `docker-compose restart backend`
   - Répétez les tests

## 📞 Support Supplémentaire

Si les problèmes persistent après avoir suivi ce guide :

1. **Collectez les informations de diagnostic :**
   ```bash
   # Sauvegardez les logs
   docker-compose logs backend > backend_logs.txt
   
   # Exportez la configuration (depuis la page de diagnostic)
   # Sauvegardez les résultats des tests
   ```

2. **Vérifiez la connectivité réseau :**
   ```bash
   # Test de connectivité SMTP
   telnet smtp.gmail.com 587
   
   # Test DNS
   nslookup smtp.gmail.com
   ```

3. **Testez avec un autre fournisseur email** (temporairement)

Ce système de diagnostic complet devrait vous permettre d'identifier et de résoudre rapidement tous les problèmes d'envoi d'email dans l'application Agde Moto.