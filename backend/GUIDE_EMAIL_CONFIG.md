# 📧 Guide de Configuration Email pour la Réinitialisation de Mot de Passe

## 🚨 Problème Résolu

Votre compte `nonhanspc@gmail.com` est maintenant configuré comme **superuser** et le **rate limiting a été réinitialisé**.

## ⚙️ Configuration Email Requise

Pour que la réinitialisation de mot de passe fonctionne, vous devez configurer l'email dans le fichier `.env` :

### Option 1: Gmail (Recommandée)

1. **Activez l'authentification à 2 facteurs** sur votre compte Gmail
2. **Générez un mot de passe d'application** :
   - Allez dans les paramètres Google → Sécurité
   - Authentification à 2 facteurs → Mots de passe des applications
   - Créez un mot de passe pour "Agde Moto"

3. **Modifiez le fichier `.env`** :
```env
EMAIL_HOST_USER=votre-email@gmail.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-application
```

### Option 2: Service SMTP Personnalisé

```env
EMAIL_HOST_USER=noreply@votredomaine.com
EMAIL_HOST_PASSWORD=votre-mot-de-passe-smtp
```

### Option 3: Service de Test (Développement)

Pour tester sans vraie configuration email :

```env
EMAIL_HOST_USER=test@example.com
EMAIL_HOST_PASSWORD=testpassword
```

## 🧪 Test de la Réinitialisation

1. **Accédez à** : http://localhost:5173/admin/password-reset
2. **Saisissez** : `nonhanspc@gmail.com`
3. **Cliquez** : "Envoyer le lien de réinitialisation"

### Si l'email est configuré :
- ✅ Vous recevrez un email avec le lien
- ✅ Le lien vous dirigera vers la page de nouveau mot de passe

### Si l'email n'est pas configuré :
- ⚠️ Le système affichera un message de succès (sécurité)
- ❌ Mais aucun email ne sera envoyé
- 📝 Consultez les logs Django pour voir l'erreur

## 🔧 Dépannage

### Problème : "Erreur de connexion"
**Cause** : Rate limiting ou configuration email manquante
**Solution** : Le cache a été vidé, réessayez maintenant

### Problème : "Email non reçu"
**Cause** : Configuration email incorrecte
**Solution** : Vérifiez les paramètres dans `.env`

### Problème : "Lien invalide"
**Cause** : Token expiré (24h) ou déjà utilisé
**Solution** : Demandez un nouveau lien

## 📋 Checklist de Vérification

- [x] ✅ Compte `nonhanspc@gmail.com` configuré comme superuser
- [x] ✅ Rate limiting réinitialisé
- [x] ✅ Serveur Django redémarré
- [ ] ⏳ Configuration email dans `.env`
- [ ] ⏳ Test de réinitialisation

## 🎯 Prochaines Étapes

1. **Configurez l'email** dans `.env`
2. **Redémarrez le serveur** (optionnel)
3. **Testez la réinitialisation** avec `nonhanspc@gmail.com`
4. **Vérifiez votre boîte email** (et dossier spam)

---

💡 **Astuce** : En développement, vous pouvez voir les emails dans les logs Django même sans configuration SMTP réelle.