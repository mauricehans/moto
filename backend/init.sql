-- Création de la base de données si elle n'existe pas
CREATE DATABASE agde_moto;

-- Création de l'utilisateur si il n'existe pas
DO
$do$
BEGIN
   IF NOT EXISTS (
      SELECT FROM pg_catalog.pg_roles
      WHERE  rolname = 'agde_user') THEN

      CREATE ROLE agde_user LOGIN PASSWORD 'agde_password123';
   END IF;
END
$do$;

-- Accorder tous les privilèges sur la base de données
GRANT ALL PRIVILEGES ON DATABASE agde_moto TO agde_user;