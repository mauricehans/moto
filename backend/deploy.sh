#!/bin/bash
set -e

echo "🚀 Déploiement Agde Moto Backend..."

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "📦 Installation des dépendances..."
pip install -r requirements.txt

# Run migrations
echo "🗄️ Application des migrations..."
python manage.py migrate

# Collect static files
echo "📁 Collecte des fichiers statiques..."
python manage.py collectstatic --noinput

# Create superuser if it doesn't exist
echo "👤 Création du superutilisateur..."
python manage.py shell -c "
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@agdemoto.fr', 'admin123')
    print('Superutilisateur créé: admin / admin123')
else:
    print('Superutilisateur déjà existant')
"

echo "✅ Déploiement terminé !"
echo "🌐 API disponible sur: http://72.62.180.174:8000/api/v1/"
echo "📚 Documentation: http://72.62.180.174:8000/api/docs/"
echo "🔧 Admin: http://72.62.180.174:8000/admin/"