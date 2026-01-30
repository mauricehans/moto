Le problème vient d'une confusion entre deux dossiers :

1.  **Le dossier "système" (réel) :** `/root/moto/active_media` (ou `/var/www/media`). C'est ici que Docker stocke les fichiers pour de vrai. Le dossier `8` y est bien présent.
2.  **Le dossier "projet" (code source) :** `/root/moto/backend/media`. C'est le dossier original de votre code. Docker **n'écrit pas** ici car il utilise le volume système pour ne pas perdre de données. C'est pour ça que vous ne voyez pas le dossier `8` dans votre explorateur de fichiers habituel s'il regarde dans `backend/media`.

**Solution :**
Vous devez regarder dans le dossier **`active_media`** (le raccourci que j'ai créé tout à l'heure à la racine de votre projet) pour voir les fichiers à jour. C'est ce dossier qui reflète la réalité du serveur.

Voulez-vous que je vous montre le contenu de ce dossier pour confirmer ?