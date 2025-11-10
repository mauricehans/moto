import os
from dotenv import load_dotenv

# Skip this environment diagnostic script when running under pytest
if os.environ.get('PYTEST_CURRENT_TEST'):
    import pytest
    pytest.skip("Skipping environment diagnostic script during pytest collection", allow_module_level=True)

# Charger le fichier .env
load_dotenv()

print("Variables d'environnement de la base de données :")
print(f"DB_NAME: {os.getenv('DB_NAME')}")
print(f"DB_USER: {os.getenv('DB_USER')}")
print(f"DB_PASSWORD: {os.getenv('DB_PASSWORD')}")
print(f"DB_HOST: {os.getenv('DB_HOST')}")
print(f"DB_PORT: {os.getenv('DB_PORT')}")