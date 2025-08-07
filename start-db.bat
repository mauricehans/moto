@echo off
echo Démarrage du conteneur PostgreSQL...
docker-compose up -d db
echo Attente du démarrage de la base de données...
timeout /t 10
echo Base de données prête !
echo.
echo Pour vous connecter à la base de données :
echo docker exec -it agde_moto_db psql -U agde_user -d agde_moto




Créez le fichier `start-db.bat` pour Windows :
```batch
@echo off
echo Démarrage du conteneur PostgreSQL...
docker-compose up -d db
echo Attente du démarrage de la base de données...
timeout /t 10
echo Base de données prête !
echo.
echo Pour vous connecter à la base de données :
echo docker exec -it agde_moto_db psql -U agde_user -d agde_moto