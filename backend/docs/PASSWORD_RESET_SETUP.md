# Configuration du système de réinitialisation de mot de passe

## Vue d'ensemble

Ce système permet aux administrateurs (superusers) de réinitialiser leur mot de passe via email de manière sécurisée.

## Fonctionnalités

✅ **Sécurité renforcée**
- Réservé aux comptes superuser uniquement
- Rate limiting (3 tentatives par heure par IP)
- Tokens sécurisés avec expiration 24h
- Logging des tentatives de réinitialisation

✅ **Interface utilisateur**
- Page de demande de réinitialisation (`/admin/password-reset`)
- Page de confirmation avec nouveau mot de passe (`/admin/reset-password/:uid/:token`)
- Validation de la force du mot de passe
- Messages d'erreur et de succès clairs

✅ **Email professionnel**
- Template HTML responsive
- Informations de sécurité (IP de la requête)
- Instructions claires
- Fallback texte

## Configuration

### 1. Variables d'environnement

Ajoutez ces variables dans votre fichier `.env` :

```env
# Configuration Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@agdemoto.com
SERVER_EMAIL=admin@agdemoto.com
```

### 2. Configuration Gmail (recommandée)

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans les paramètres de votre compte Google
   - Sécurité → Authentification à 2 facteurs → Mots de passe des applications
   - Générez un mot de passe pour "Agde Moto"
   - Utilisez ce mot de passe dans `EMAIL_HOST_PASSWORD`

### 3. Configuration alternative (SMTP personnalisé)

```env
EMAIL_HOST=mail.yourdomain.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=noreply@yourdomain.com
EMAIL_HOST_PASSWORD=your-smtp-password
```

## Utilisation

### Pour les administrateurs

1. **Accéder à la page de connexion** : `/admin`
2. **Cliquer sur "Mot de passe oublié ?"**
3. **Saisir l'email administrateur**
4. **Vérifier l'email reçu**
5. **Cliquer sur le lien de réinitialisation**
6. **Définir un nouveau mot de passe sécurisé**

### Sécurité du mot de passe

Le système évalue la force du mot de passe en temps réel :
- **Minimum 8 caractères**
- **Majuscules et minuscules**
- **Chiffres**
- **Caractères spéciaux**

## API Endpoints

### Demande de réinitialisation
```http
POST /api/admin/password-reset/
Content-Type: application/json

{
  "email": "admin@agdemoto.com"
}
```

**Réponse de succès :**
```json
{
  "message": "Un email de réinitialisation a été envoyé à votre adresse."
}
```

### Confirmation de réinitialisation
```http
POST /api/admin/password-reset/{uidb64}/{token}/
Content-Type: application/json

{
  "new_password": "MonNouveauMotDePasse123!",
  "confirm_password": "MonNouveauMotDePasse123!"
}
```

**Réponse de succès :**
```json
{
  "message": "Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter."
}
```

## Sécurité et limitations

### Rate Limiting
- **Demande de réinitialisation** : 3 tentatives par heure par IP
- **Confirmation** : 5 tentatives par heure par IP

### Validation
- Seuls les comptes **superuser actifs** peuvent demander une réinitialisation
- Les tokens expirent après **24 heures**
- Les tokens ne peuvent être utilisés qu'**une seule fois**

### Logging
Toutes les tentatives sont loggées :
- Demandes de réinitialisation réussies
- Tentatives sur des emails non autorisés
- Réinitialisations réussies
- Erreurs d'envoi d'email

## Dépannage

### Problème : Email non reçu

1. **Vérifiez les logs Django** :
   ```bash
   tail -f logs/agde_moto.log
   ```

2. **Vérifiez la configuration email** :
   ```python
   # Dans le shell Django
   from django.core.mail import send_mail
   send_mail('Test', 'Message de test', 'from@example.com', ['to@example.com'])
   ```

3. **Vérifiez les dossiers spam/indésirables**

### Problème : Token invalide

- Les tokens expirent après 24h
- Ils ne peuvent être utilisés qu'une fois
- Demandez un nouveau lien si nécessaire

### Problème : Rate limiting

- Attendez 1 heure avant de réessayer
- Ou redémarrez le serveur en développement

## Maintenance

### Nettoyage des logs
```bash
# Garder seulement les 30 derniers jours
find logs/ -name "*.log" -mtime +30 -delete
```

### Surveillance
Surveillez ces métriques :
- Nombre de demandes de réinitialisation par jour
- Taux d'échec d'envoi d'email
- Tentatives sur des comptes non autorisés

## Améliorations futures

- [ ] Notification par SMS en backup
- [ ] Interface d'administration pour gérer les demandes
- [ ] Historique des réinitialisations
- [ ] Intégration avec un service d'email transactionnel (SendGrid, Mailgun)
- [ ] Support multi-langues

## Support

Pour toute question ou problème :
1. Consultez les logs Django
2. Vérifiez la configuration email
3. Testez avec un compte de test
4. Contactez l'équipe de développement