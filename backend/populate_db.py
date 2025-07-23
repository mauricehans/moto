#!/usr/bin/env python3
"""Script pour remplir la base de données avec des données de test"""

import os
import sys
import django
from decimal import Decimal

# Ajouter le dossier backend au path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Configuration Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
django.setup()

from motorcycles.models import Motorcycle, MotorcycleImage
from parts.models import Category as PartCategory, Part, PartImage
from blog.models import Category as BlogCategory, Post
from garage.models import GarageSettings

def create_motorcycles():
    """Créer des motos de test"""
    print("Creation des motos...")
    
    motorcycles_data = [
        {
            'brand': 'Yamaha',
            'model': 'MT-07',
            'year': 2022,
            'price': Decimal('6999.00'),
            'mileage': 3500,
            'engine': '689 cc',
            'power': 73,
            'license': 'A2',
            'color': 'Noir',
            'description': 'Yamaha MT-07 en excellent état, entretien récent effectué, pneus neufs, aucun frais à prévoir. Moto très agréable à conduire, idéale pour débuter ou pour un usage quotidien.',
            'is_new': True,
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/2611686/pexels-photo-2611686.jpeg',
                'https://images.pexels.com/photos/163210/motorcycles-race-helmets-pilots-163210.jpeg',
                'https://images.pexels.com/photos/595807/pexels-photo-595807.jpeg'
            ]
        },
        {
            'brand': 'Honda',
            'model': 'CB650R',
            'year': 2021,
            'price': Decimal('7499.00'),
            'mileage': 8200,
            'engine': '649 cc',
            'power': 95,
            'license': 'A',
            'color': 'Rouge',
            'description': 'Honda CB650R Neo Sports Cafe en parfait état. Entretien suivi chez concessionnaire Honda. Moto polyvalente et fiable avec un look néo-rétro très réussi.',
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg',
                'https://images.pexels.com/photos/819805/pexels-photo-819805.jpeg'
            ]
        },
        {
            'brand': 'Kawasaki',
            'model': 'Z900',
            'year': 2020,
            'price': Decimal('8299.00'),
            'mileage': 12500,
            'engine': '948 cc',
            'power': 125,
            'license': 'A',
            'color': 'Vert',
            'description': 'Kawasaki Z900 en très bon état, révision complète récente, pneus neufs. Roadster puissant et réactif, position de conduite confortable pour la route.',
            'images': [
                'https://images.pexels.com/photos/819805/pexels-photo-819805.jpeg',
                'https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg'
            ]
        },
        {
            'brand': 'BMW',
            'model': 'R 1250 GS',
            'year': 2021,
            'price': Decimal('16500.00'),
            'mileage': 15800,
            'engine': '1254 cc',
            'power': 136,
            'license': 'A',
            'color': 'Blanc',
            'description': 'BMW R 1250 GS, la référence des trails routiers. Parfaitement entretenue, équipée de nombreuses options, prête pour les grandes aventures.',
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg',
                'https://images.pexels.com/photos/995487/pexels-photo-995487.jpeg'
            ]
        },
        {
            'brand': 'Ducati',
            'model': 'Monster 937',
            'year': 2022,
            'price': Decimal('11999.00'),
            'mileage': 4200,
            'engine': '937 cc',
            'power': 111,
            'license': 'A',
            'color': 'Rouge',
            'description': 'Ducati Monster 937, le roadster iconique dans sa dernière évolution. État impeccable, son caractéristique Ducati, performances de haut niveau.',
            'is_new': True,
            'images': [
                'https://images.pexels.com/photos/1045535/pexels-photo-1045535.jpeg',
                'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg'
            ]
        },
        {
            'brand': 'Triumph',
            'model': 'Street Triple RS',
            'year': 2021,
            'price': Decimal('10999.00'),
            'mileage': 9800,
            'engine': '765 cc',
            'power': 123,
            'license': 'A',
            'color': 'Gris',
            'description': 'Triumph Street Triple RS, le roadster sportif britannique par excellence. Équipée de composants haut de gamme, cette moto offre des performances exceptionnelles.',
            'images': [
                'https://images.pexels.com/photos/258092/pexels-photo-258092.jpeg',
                'https://images.pexels.com/photos/1715193/pexels-photo-1715193.jpeg'
            ]
        }
    ]
    
    for moto_data in motorcycles_data:
        images = moto_data.pop('images')
        motorcycle, created = Motorcycle.objects.get_or_create(
            brand=moto_data['brand'],
            model=moto_data['model'],
            year=moto_data['year'],
            defaults=moto_data
        )
        
        if created:
            print(f"[OK] Moto créée: {motorcycle.brand} {motorcycle.model}")
            
            # Ajouter les images
            for i, image_url in enumerate(images):
                MotorcycleImage.objects.create(
                    motorcycle=motorcycle,
                    image=image_url,
                    is_primary=(i == 0)
                )
        else:
            print(f"[WARN] Moto deja existante: {motorcycle.brand} {motorcycle.model}")

def create_part_categories():
    """Créer les catégories de pièces"""
    print("Creation des categories de pieces...")
    
    categories = [
        {'name': 'Échappement', 'slug': 'echappement', 'description': 'Systèmes d\'échappement et silencieux'},
        {'name': 'Freinage', 'slug': 'freinage', 'description': 'Plaquettes, disques et systèmes de freinage'},
        {'name': 'Suspension', 'slug': 'suspension', 'description': 'Amortisseurs, fourches et composants de suspension'},
        {'name': 'Carrosserie', 'slug': 'carrosserie', 'description': 'Carénages, réservoirs et éléments de carrosserie'},
        {'name': 'Transmission', 'slug': 'transmission', 'description': 'Chaînes, couronnes et pignons'},
        {'name': 'Moteur', 'slug': 'moteur', 'description': 'Filtres, bougies et pièces moteur'},
        {'name': 'Accessoires', 'slug': 'accessoires', 'description': 'Rétroviseurs, poignées et accessoires divers'},
        {'name': 'Commandes', 'slug': 'commandes', 'description': 'Leviers, pédales et commandes'},
        {'name': 'Pneumatiques', 'slug': 'pneumatiques', 'description': 'Pneus avant et arrière'},
        {'name': 'Électronique', 'slug': 'electronique', 'description': 'Compteurs, éclairage et électronique'}
    ]
    
    for cat_data in categories:
        category, created = PartCategory.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"[OK] Categorie creee: {category.name}")

def create_parts():
    """Créer des pièces détachées de test"""
    print("Creation des pieces detachees...")
    
    # Récupérer les catégories
    echappement = PartCategory.objects.get(slug='echappement')
    freinage = PartCategory.objects.get(slug='freinage')
    suspension = PartCategory.objects.get(slug='suspension')
    carrosserie = PartCategory.objects.get(slug='carrosserie')
    transmission = PartCategory.objects.get(slug='transmission')
    moteur = PartCategory.objects.get(slug='moteur')
    accessoires = PartCategory.objects.get(slug='accessoires')
    commandes = PartCategory.objects.get(slug='commandes')
    pneumatiques = PartCategory.objects.get(slug='pneumatiques')
    electronique = PartCategory.objects.get(slug='electronique')
    
    parts_data = [
        {
            'name': 'Pot d\'échappement Akrapovic Slip-On',
            'category': echappement,
            'brand': 'Akrapovic',
            'compatible_models': 'Yamaha MT-07, MT-09',
            'price': Decimal('450.00'),
            'stock': 3,
            'condition': 'new',
            'description': 'Pot d\'échappement sport en titane Akrapovic Slip-On. Améliore les performances et le son de votre moto. Installation facile sans modification.',
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg',
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
            ]
        },
        {
            'name': 'Plaquettes de frein Brembo Z04',
            'category': freinage,
            'brand': 'Brembo',
            'compatible_models': 'Honda CBR600RR, CBR1000RR',
            'price': Decimal('89.00'),
            'stock': 12,
            'condition': 'new',
            'description': 'Plaquettes de frein haute performance Brembo Z04. Excellent mordant et résistance à la température. Idéales pour la piste.',
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
                'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
            ]
        },
        {
            'name': 'Amortisseur arrière Öhlins TTX GP',
            'category': suspension,
            'brand': 'Öhlins',
            'compatible_models': 'Kawasaki ZX-10R, Ninja 1000',
            'price': Decimal('1250.00'),
            'stock': 2,
            'condition': 'new',
            'description': 'Amortisseur arrière Öhlins TTX GP de compétition. Réglages compression et détente séparés. Performance exceptionnelle sur piste.',
            'images': [
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg',
                'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg'
            ]
        },
        {
            'name': 'Carénage avant Ducati Panigale V4',
            'category': carrosserie,
            'brand': 'Ducati',
            'compatible_models': 'Ducati Panigale V4, V4S',
            'price': Decimal('680.00'),
            'stock': 1,
            'condition': 'used_excellent',
            'description': 'Carénage avant d\'origine Ducati Panigale V4 en excellent état. Aucun impact, peinture d\'origine. Fixations incluses.',
            'images': [
                'https://images.pexels.com/photos/1045535/pexels-photo-1045535.jpeg',
                'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
            ]
        },
        {
            'name': 'Kit chaîne DID VX3',
            'category': transmission,
            'brand': 'DID',
            'compatible_models': 'BMW S1000RR, HP4',
            'price': Decimal('165.00'),
            'stock': 8,
            'condition': 'new',
            'description': 'Kit chaîne complet DID VX3 avec joints X-Ring. Haute résistance et longévité. Comprend chaîne, pignon et couronne.',
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg',
                'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg'
            ]
        },
        {
            'name': 'Filtre à air K&N Performance',
            'category': moteur,
            'brand': 'K&N',
            'compatible_models': 'Triumph Street Triple, Speed Triple',
            'price': Decimal('75.00'),
            'stock': 15,
            'condition': 'new',
            'description': 'Filtre à air haute performance K&N lavable et réutilisable. Améliore le débit d\'air et les performances du moteur.',
            'images': [
                'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg',
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
            ]
        },
        {
            'name': 'Rétroviseurs CRG Arrow',
            'category': accessoires,
            'brand': 'CRG',
            'compatible_models': 'Universel (filetage M10)',
            'price': Decimal('120.00'),
            'stock': 6,
            'condition': 'new',
            'description': 'Rétroviseurs CRG Arrow design sportif. Miroir anti-éblouissement et fixation solide. Look racing garanti.',
            'images': [
                'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
                'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg'
            ]
        },
        {
            'name': 'Levier d\'embrayage Brembo RCS',
            'category': commandes,
            'brand': 'Brembo',
            'compatible_models': 'Ducati Monster, Streetfighter',
            'price': Decimal('280.00'),
            'stock': 4,
            'condition': 'new',
            'description': 'Levier d\'embrayage Brembo RCS avec réglage de distance. Précision et confort de pilotage améliorés.',
            'images': [
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg',
                'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg'
            ]
        },
        {
            'name': 'Pneu avant Michelin Power RS',
            'category': pneumatiques,
            'brand': 'Michelin',
            'compatible_models': '120/70 ZR17 (avant)',
            'price': Decimal('145.00'),
            'stock': 10,
            'condition': 'new',
            'description': 'Pneu sport-touring Michelin Power RS. Excellent compromis performance/longévité. Adhérence exceptionnelle sur sec et mouillé.',
            'is_featured': True,
            'images': [
                'https://images.pexels.com/photos/2539322/pexels-photo-2539322.jpeg',
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
            ]
        },
        {
            'name': 'Compteur digital Koso RX3',
            'category': electronique,
            'brand': 'Koso',
            'compatible_models': 'Universel (adaptable)',
            'price': Decimal('320.00'),
            'stock': 3,
            'condition': 'new',
            'description': 'Compteur digital multifonctions Koso RX3. Écran couleur TFT, nombreuses fonctions, design moderne.',
            'images': [
                'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
                'https://images.pexels.com/photos/8985454/pexels-photo-8985454.jpeg'
            ]
        }
    ]
    
    for part_data in parts_data:
        images = part_data.pop('images')
        part, created = Part.objects.get_or_create(
            name=part_data['name'],
            brand=part_data['brand'],
            defaults=part_data
        )
        
        if created:
            print(f"[OK] Piece creee: {part.name}")
            
            # Ajouter les images
            for i, image_url in enumerate(images):
                PartImage.objects.create(
                    part=part,
                    image=image_url,
                    is_primary=(i == 0)
                )
        else:
            print(f"[WARN] Piece deja existante: {part.name}")

def create_blog_categories():
    """Créer les catégories de blog"""
    print("Creation des categories de blog...")
    
    categories = [
        {'name': 'Conseils', 'slug': 'conseils', 'description': 'Conseils et astuces moto'},
        {'name': 'Actualités', 'slug': 'actualites', 'description': 'Actualités du monde de la moto'},
        {'name': 'Tests', 'slug': 'tests', 'description': 'Tests et essais de motos'},
        {'name': 'Entretien', 'slug': 'entretien', 'description': 'Guides d\'entretien et maintenance'}
    ]
    
    for cat_data in categories:
        category, created = BlogCategory.objects.get_or_create(
            slug=cat_data['slug'],
            defaults=cat_data
        )
        if created:
            print(f"[OK] Categorie blog creee: {category.name}")

def create_blog_posts():
    """Créer des articles de blog de test"""
    print("Creation des articles de blog...")
    
    conseils = BlogCategory.objects.get(slug='conseils')
    actualites = BlogCategory.objects.get(slug='actualites')
    tests = BlogCategory.objects.get(slug='tests')
    entretien = BlogCategory.objects.get(slug='entretien')
    
    posts_data = [
        {
            'title': 'Les meilleures motos pour débuter',
            'slug': 'meilleures-motos-debuter',
            'category': conseils,
            'content': '''Choisir sa première moto est une étape cruciale pour tout motard débutant. Il est important de prendre en compte plusieurs critères pour faire le bon choix.

**1. La puissance adaptée**
Pour débuter, il est recommandé de choisir une moto avec une puissance modérée. Les motos de 125cc à 650cc sont idéales pour apprendre les bases de la conduite.

**2. La position de conduite**
Privilégiez une position de conduite droite et confortable. Les roadsters et les trails sont parfaits pour débuter.

**3. Le poids de la moto**
Une moto légère sera plus facile à manœuvrer, surtout à l'arrêt et dans les manœuvres de parking.

**Nos recommandations :**
- Yamaha MT-07 : Parfait équilibre entre puissance et facilité
- Honda CB650R : Fiable et polyvalente
- Kawasaki Z650 : Moderne et accessible

N'hésitez pas à venir essayer nos motos d'occasion chez Agde Moto Gattuso !''',
            'image': 'https://images.pexels.com/photos/2519374/pexels-photo-2519374.jpeg',
            'is_published': True
        },
        {
            'title': 'Comment bien entretenir sa moto en hiver',
            'slug': 'entretien-moto-hiver',
            'category': entretien,
            'content': '''L'hiver est une période délicate pour nos motos. Voici nos conseils pour bien préparer et entretenir votre moto pendant la saison froide.

**Préparation avant l'hivernage :**
1. Nettoyage complet de la moto
2. Vidange moteur et changement du filtre à huile
3. Vérification et gonflage des pneus
4. Protection de la batterie

**Stockage optimal :**
- Garage sec et aéré
- Bâche respirante
- Béquille d'atelier pour soulager les pneus

**Entretien périodique :**
Même en hiver, il est important de faire tourner le moteur régulièrement et de vérifier l'état général de la moto.

Notre atelier reste ouvert tout l'hiver pour vos révisions et entretiens !''',
            'image': 'https://images.pexels.com/photos/3807319/pexels-photo-3807319.jpeg',
            'is_published': True
        },
        {
            'title': 'Test : BMW R 1250 GS, la reine des trails',
            'slug': 'test-bmw-r1250gs',
            'category': tests,
            'content': '''Nous avons eu l'occasion de tester la BMW R 1250 GS, référence absolue dans le monde des trails routiers.

**Performances :**
Le bicylindre boxer de 1254cc développe 136 chevaux et offre un couple généreux dès les bas régimes. L'accélération est franche et la vitesse de pointe largement suffisante.

**Confort :**
La position de conduite est excellente, la selle confortable même sur de longs trajets. Les suspensions semi-actives s'adaptent parfaitement au terrain.

**Équipements :**
- ABS Pro avec fonction courbe
- Contrôle de traction adaptatif
- Modes de conduite multiples
- Éclairage LED intégral

**Verdict :**
Une moto exceptionnelle qui justifie sa réputation. Parfaite pour les grands voyages comme pour l'usage quotidien.

Nous avons actuellement une R 1250 GS en stock, venez la découvrir !''',
            'image': 'https://images.pexels.com/photos/2393821/pexels-photo-2393821.jpeg',
            'is_published': True
        },
        {
            'title': 'Nouveautés 2024 : ce qui nous attend',
            'slug': 'nouveautes-2024',
            'category': actualites,
            'content': '''L'année 2024 s'annonce riche en nouveautés dans le monde de la moto. Voici un aperçu des modèles qui nous ont marqués.

**Yamaha MT-09 SP :**
Version haut de gamme de la populaire MT-09 avec suspensions Öhlins et freins Brembo.

**Honda CB1000R Black Edition :**
Une version encore plus radicale du roadster japonais.

**Ducati Streetfighter V4 SP2 :**
L'évolution de la bête italienne avec encore plus de technologie.

**Tendances 2024 :**
- Électrification progressive
- Connectivité renforcée
- Aides à la conduite avancées

Nous suivons de près ces évolutions pour vous proposer les meilleures occasions !''',
            'image': 'https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg',
            'is_published': True
        }
    ]
    
    for post_data in posts_data:
        post, created = Post.objects.get_or_create(
            slug=post_data['slug'],
            defaults=post_data
        )
        
        if created:
            print(f"[OK] Article cree: {post.title}")
        else:
            print(f" Article deja existant: {post.title}")

def create_garage_settings():
    """Créer les paramètres du garage avec des liens sociaux fictifs"""
    print("Creation des parametres du garage...")
    
    # Supprimer les paramètres existants
    GarageSettings.objects.all().delete()
    
    settings = GarageSettings.objects.create(
        name='Agde Moto Gattuso',
        address='123 Avenue de la Plage, 34300 Agde, France',
        phone='+33 4 67 12 34 56',
        email='contact@agdemoto.fr',
        website='https://agdemoto.fr',
        description='Votre spécialiste moto à Agde depuis 2005. Vente de motos d\'occasion et pièces détachées sélectionnées avec soin.',
        social_media_json='{"facebook": "https://facebook.com/agdemoto34", "instagram": "https://instagram.com/agde_moto_officiel", "youtube": "https://youtube.com/@AgdeMotoPro", "twitter": "https://twitter.com/agdemoto", "linkedin": "https://linkedin.com/company/agde-moto"}',
        business_hours_json='{"monday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "12:00"}, {"open": "14:00", "close": "18:00"}]}, "tuesday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "12:00"}, {"open": "14:00", "close": "18:00"}]}, "wednesday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "12:00"}, {"open": "14:00", "close": "18:00"}]}, "thursday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "12:00"}, {"open": "14:00", "close": "18:00"}]}, "friday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "12:00"}, {"open": "14:00", "close": "18:00"}]}, "saturday": {"is_closed": false, "intervals": [{"open": "09:00", "close": "17:00"}]}, "sunday": {"is_closed": true, "intervals": []}}',
        seo_settings_json='{"meta_title": "AGDE MOTO - Spécialiste moto à Agde", "meta_description": "Votre spécialiste moto à Agde depuis 2005. Vente de motos d\'occasion et pièces détachées.", "keywords": "moto, agde, occasion, pièces détachées"}'
    )
    
    print(f"[OK] Parametres du garage crees: {settings.name}")

def main():
    """Fonction principale"""
    print("Demarrage du peuplement de la base de donnees...")
    
    try:
        # Supprimer les données existantes
        print("Suppression des donnees existantes...")
        MotorcycleImage.objects.all().delete()
        Motorcycle.objects.all().delete()
        PartImage.objects.all().delete()
        Part.objects.all().delete()
        PartCategory.objects.all().delete()
        Post.objects.all().delete()
        BlogCategory.objects.all().delete()
        GarageSettings.objects.all().delete()
        
        # Créer les nouvelles données
        create_motorcycles()
        create_part_categories()
        create_parts()
        create_blog_categories()
        create_blog_posts()
        create_garage_settings()
        
        print("Base de donnees peuplee avec succes !")
        print(f"Statistiques :")
        print(f"   - Motos: {Motorcycle.objects.count()}")
        print(f"   - Images motos: {MotorcycleImage.objects.count()}")
        print(f"   - Catégories pièces: {PartCategory.objects.count()}")
        print(f"   - Pièces: {Part.objects.count()}")
        print(f"   - Images pièces: {PartImage.objects.count()}")
        print(f"   - Catégories blog: {BlogCategory.objects.count()}")
        print(f"   - Articles blog: {Post.objects.count()}")
        print(f"   - Paramètres garage: {GarageSettings.objects.count()}")
        
    except Exception as e:
        print(f"Erreur lors du peuplement: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()