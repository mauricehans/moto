import os
import django
from django.utils.text import slugify

# Configuration de l'environnement Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'agde_moto.settings')
django.setup()

from motorcycles.models import Motorcycle, MotorcycleImage
from parts.models import Part, Category as PartCategory, PartImage
from blog.models import Post, Category as BlogCategory
from django.contrib.auth import get_user_model

User = get_user_model()

def run():
    print("--- Démarrage du remplissage de la base de données ---")

    # Récupérer l'admin pour l'auteur des articles (optionnel pour Post dans ce modèle simplifié ?)
    # Le modèle Post n'a pas de champ author visible dans le cat précédent, vérifions si erreur
    # Ah si, Post n'a pas de champ author dans le models.py que j'ai lu ! 
    # Je vais l'ignorer.

    # --- 1. MOTOS ---
    print("Création des motos...")
    motos_data = [
        {
            "brand": "Yamaha",
            "model": "MT-07",
            "year": 2023,
            "price": 7500,
            "mileage": 1200,
            "engine": "CP2 689cc",
            "power": 73,
            "license": "A2",
            "color": "Cyan Storm",
            "description": "La référence des roadsters. Moteur CP2 coupleux, agilité redoutable. Idéale pour débuter ou s'amuser. État neuf, révision des 1000km faite.",
            "status": "available",
            "image_url": "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?q=80&w=1000&auto=format&fit=crop",
        },
        {
            "brand": "BMW",
            "model": "R 1250 GS",
            "year": 2022,
            "price": 18900,
            "mileage": 15000,
            "engine": "Boxer 1254cc",
            "power": 136,
            "license": "A",
            "color": "Triple Black",
            "description": "La reine des trails. Confort royal, équipement complet (Pack Confort, Touring, Dynamique). Valises incluses. Prête pour le tour du monde.",
            "status": "available",
            "image_url": "https://images.unsplash.com/photo-1625043484555-47841a752840?q=80&w=1000&auto=format&fit=crop",
        },
        {
            "brand": "Ducati",
            "model": "Panigale V4",
            "year": 2024,
            "price": 28500,
            "mileage": 500,
            "engine": "V4 1103cc",
            "power": 214,
            "license": "A",
            "color": "Rouge Ducati",
            "description": "Une machine de course homologuée route. 214 ch, électronique de pointe. Pour passionnés avertis. État showroom.",
            "status": "available",
            "image_url": "https://images.unsplash.com/photo-1622185135505-2d795043dfeb?q=80&w=1000&auto=format&fit=crop",
        },
        {
            "brand": "Triumph",
            "model": "Bonneville T120",
            "year": 2021,
            "price": 11200,
            "mileage": 8500,
            "engine": "Twin 1200cc",
            "power": 80,
            "license": "A",
            "color": "Jet Black",
            "description": "Le style classique intemporel avec la technologie moderne. Moteur 1200cc High Torque. Entretien à jour carnet complet.",
            "status": "sold",
            "image_url": "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1000&auto=format&fit=crop",
        }
    ]

    for data in motos_data:
        if not Motorcycle.objects.filter(brand=data['brand'], model=data['model']).exists():
            moto = Motorcycle.objects.create(
                brand=data['brand'],
                model=data['model'],
                year=data['year'],
                price=data['price'],
                mileage=data['mileage'],
                engine=data['engine'],
                power=data['power'],
                license=data['license'],
                color=data['color'],
                description=data['description'],
                is_sold=(data['status'] == 'sold'),
                is_new=(data['mileage'] == 0)
            )
            
            # Image URL
            MotorcycleImage.objects.create(
                motorcycle=moto,
                image=data['image_url'],
                is_primary=True
            )
            print(f"Moto créée : {data['brand']} {data['model']}")
        else:
            print(f"Moto existante : {data['brand']} {data['model']}")

    # --- 2. PIÈCES DÉTACHÉES ---
    print("\nCréation des pièces...")
    
    cats = {
        "Freinage": "Tout pour le freinage",
        "Moteur": "Huiles et filtres",
        "Échappement": "Silencieux et lignes",
        "Pneumatiques": "Pneus route et piste"
    }
    
    cat_objects = {}
    for name, desc in cats.items():
        cat, _ = PartCategory.objects.get_or_create(
            name=name, 
            defaults={'description': desc, 'slug': slugify(name)}
        )
        cat_objects[name] = cat

    parts_data = [
        {
            "name": "Silencieux Akrapovic Titane",
            "brand": "Akrapovic",
            "cat": "Échappement",
            "price": 890.00,
            "stock": 3,
            "desc": "Silencieux slip-on en titane. Gain de poids et sonorité envoûtante. Homologué route.",
            "compatible": "Yamaha MT-07 2021+, Tracer 700",
            "image_url": "https://images.unsplash.com/photo-1563820227-2c98d6335a96?q=80&w=1000&auto=format&fit=crop"
        },
        {
            "name": "Plaquettes Racing SC",
            "brand": "Brembo",
            "cat": "Freinage",
            "price": 45.90,
            "stock": 20,
            "desc": "Plaquettes en métal fritté pour un freinage mordant. Idéal usage sportif route/piste.",
            "compatible": "Universel étriers Brembo M4/M50",
            "image_url": "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=1000&auto=format&fit=crop"
        },
        {
            "name": "Huile 7100 10W40 (4L)",
            "brand": "Motul",
            "cat": "Moteur",
            "price": 59.90,
            "stock": 50,
            "desc": "Huile 100% synthèse Ester. La référence pour protéger votre moteur. Bidon de 4 Litres.",
            "compatible": "Tous moteurs 4T",
            "image_url": "https://m.media-amazon.com/images/I/71Y-3s2N+IL._AC_SL1500_.jpg"
        },
        {
            "name": "Road 6 Arrière 180/55",
            "brand": "Michelin",
            "cat": "Pneumatiques",
            "price": 165.00,
            "stock": 8,
            "desc": "Le nouveau standard du pneu sport-touring. Grip exceptionnel sur le mouillé et longévité accrue.",
            "compatible": "Jantes 17 pouces",
            "image_url": "https://images.unsplash.com/photo-1578844251758-2f71da645217?q=80&w=1000&auto=format&fit=crop"
        }
    ]

    for data in parts_data:
        if not Part.objects.filter(name=data['name']).exists():
            part = Part.objects.create(
                name=data['name'],
                category=cat_objects.get(data['cat']),
                brand=data['brand'],
                compatible_models=data['compatible'],
                price=data['price'],
                stock=data['stock'],
                description=data['desc'],
                is_available=True,
                condition='new'
            )
            
            PartImage.objects.create(
                part=part,
                image=data['image_url'],
                is_primary=True
            )
            print(f"Pièce créée : {data['name']}")
        else:
             print(f"Pièce existante : {data['name']}")


    # --- 3. BLOG ---
    print("\nCréation du blog...")
    
    blog_cats = {
        "Tutoriels": "Guides pratiques",
        "Essais": "Tests de motos",
        "Événements": "Sorties et actus"
    }
    
    blog_cat_objects = {}
    for name, desc in blog_cats.items():
        cat, _ = BlogCategory.objects.get_or_create(
            name=name, 
            defaults={'description': desc, 'slug': slugify(name)}
        )
        blog_cat_objects[name] = cat

    posts_data = [
        {
            "title": "Préparer sa moto pour l'hivernage",
            "cat": "Tutoriels",
            "content": "L'hiver approche et votre moto va peut-être moins rouler. Voici nos conseils pour la préserver : \n\n1. Nettoyage complet et graissage de la chaîne.\n2. Plein d'essence (pour éviter la rouille du réservoir).\n3. Batterie sous mainteneur de charge.\n4. Surélévation des pneus si possible.\n\nPrenez soin de votre belle !",
            "image_url": "https://images.unsplash.com/photo-1632233261626-d3527e7428c9?q=80&w=1000&auto=format&fit=crop"
        },
        {
            "title": "Essai de la nouvelle BMW R 1300 GS",
            "cat": "Essais",
            "content": "Nous avons eu la chance d'essayer la remplaçante de la légende. Plus légère, plus puissante, plus compacte. Est-ce toujours la reine ?\n\nNotre verdict après 200km dans l'Hérault est sans appel : C'est une machine redoutable d'efficacité. Le moteur Boxer est encore plus plein...",
            "image_url": "https://images.unsplash.com/photo-1609630875171-b1321377ee53?q=80&w=1000&auto=format&fit=crop"
        },
        {
            "title": "Balade du dimanche : Les Gorges de l'Hérault",
            "cat": "Événements",
            "content": "Ce dimanche, l'équipe d'Agde Moto organise une sortie. Départ 9h du magasin. Au programme : Saint-Guilhem-le-Désert, le Causse du Larzac et retour par le lac du Salagou.\n\nOuvert à toutes les cylindrées. Pique-nique à prévoir !",
            "image_url": "https://images.unsplash.com/photo-1498661694102-0a3793edbe74?q=80&w=1000&auto=format&fit=crop"
        }
    ]

    for data in posts_data:
        if not Post.objects.filter(title=data['title']).exists():
            post = Post.objects.create(
                title=data['title'],
                slug=slugify(data['title']),
                category=blog_cat_objects.get(data['cat']),
                content=data['content'],
                image=data['image_url'],
                is_published=True
            )
            print(f"Article créé : {data['title']}")
        else:
            print(f"Article existant : {data['title']}")

    print("\n--- Terminé avec succès ! ---")

if __name__ == '__main__':
    run()
