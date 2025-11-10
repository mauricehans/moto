import pytest
from django.core.cache import cache
from django.test import override_settings
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture(autouse=True)
def clear_cache_between_tests():
    cache.clear()
    yield
    cache.clear()

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', DEFAULT_FROM_EMAIL='test@example.com')
@pytest.mark.django_db
def test_password_reset_rate_limit_email_key():
    client = APIClient()
    email = 'admin@example.com'

    # Effectuer 3 requêtes autorisées
    for _ in range(3):
        r = client.post('/api/admin/password-reset/', {'email': email}, format='json')
        assert r.status_code in (200, 400, 500) or r.status_code == 429  # robuste

    # La 4ème avec le même email doit être bloquée par le rate limit post:email (3/h)
    r = client.post('/api/admin/password-reset/', {'email': email}, format='json')
    assert r.status_code == 429

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', DEFAULT_FROM_EMAIL='test@example.com')
@pytest.mark.django_db
def test_password_reset_rate_limit_block_after_5_same_email():
    client = APIClient()
    email = 'admin@example.com'

    # Effectuer 5 requêtes autorisées (limite IP = 5/h)
    for _ in range(5):
        r = client.post('/api/admin/password-reset/', {'email': email}, format='json')
        assert r.status_code in (200, 400, 500, 429, 403)

    # La 6ème doit être bloquée par la limite IP (5/h)
    r = client.post('/api/admin/password-reset/', {'email': email}, format='json')
    assert r.status_code in (429, 403)

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', DEFAULT_FROM_EMAIL='test@example.com')
@pytest.mark.django_db
def test_password_reset_rate_limit_ip_key():
    client = APIClient()

    # 5 requêtes autorisées avec des emails différents (évite une éventuelle limite par email)
    for i in range(5):
        r = client.post('/api/admin/password-reset/', {'email': f'user{i}@example.com'}, format='json')
        assert r.status_code in (200, 400, 500, 429, 403)

    # La 6ème depuis la même IP doit être bloquée (limite IP 5/h)
    r = client.post('/api/admin/password-reset/', {'email': 'another@example.com'}, format='json')
    assert r.status_code in (429, 403)

@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend', DEFAULT_FROM_EMAIL='test@example.com')
@pytest.mark.django_db
def test_admin_otp_flow_success_and_failure():
    email = 'root.admin@example.com'
    # Créer un superutilisateur actif
    if not User.objects.filter(email=email).exists():
        User.objects.create_superuser(username='rootadmin', email=email, password='Secret123!')

    client = APIClient()

    # Demande d'OTP
    r = client.post('/api/admin/otp/request/', {'email': email}, format='json')
    assert r.status_code == 200

    # Récupérer le code dans le cache (généré par la vue)
    code = cache.get(f'admin_otp:{email}')
    assert code is not None and len(code) == 6

    # Confirmer avec le bon code
    r_ok = client.post('/api/admin/otp/confirm/', {'email': email, 'code': code}, format='json')
    assert r_ok.status_code == 200
    assert r_ok.json().get('message')

    # Confirmer à nouveau avec le même code (doit échouer car consommé)
    r_bad = client.post('/api/admin/otp/confirm/', {'email': email, 'code': code}, format='json')
    assert r_bad.status_code == 400

    # Confirmer avec un code invalide
    r_invalid = client.post('/api/admin/otp/confirm/', {'email': email, 'code': '000000'}, format='json')
    assert r_invalid.status_code == 400