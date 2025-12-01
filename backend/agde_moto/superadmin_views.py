from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status

User = get_user_model()

def _is_super_superadmin(user):
    return user.is_superuser and user.is_staff

@api_view(['GET'])
@permission_classes([IsAdminUser])
def list_admins(request):
    if not _is_super_superadmin(request.user):
        return Response({'error': 'Permission refusée'}, status=status.HTTP_403_FORBIDDEN)
    qs = User.objects.filter(is_staff=True).values('id','username','email','is_superuser','is_active')
    return Response({'admins': list(qs)})

@api_view(['POST'])
@permission_classes([IsAdminUser])
def create_admin(request):
    if not _is_super_superadmin(request.user):
        return Response({'error': 'Permission refusée'}, status=status.HTTP_403_FORBIDDEN)
    email = (request.data.get('email') or '').strip().lower()
    username = (request.data.get('username') or '').strip() or email.split('@')[0]
    password = request.data.get('password') or ''
    is_super = bool(request.data.get('is_superuser'))
    if not email or not password:
        return Response({'error': 'email et password requis'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email déjà utilisé'}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_staff = True
    user.is_superuser = bool(is_super)
    user.is_active = True
    user.save()
    return Response({'id': user.id, 'username': user.username, 'email': user.email, 'is_superuser': user.is_superuser}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_admin(request, user_id):
    if not _is_super_superadmin(request.user):
        return Response({'error': 'Permission refusée'}, status=status.HTTP_403_FORBIDDEN)
    try:
        user = User.objects.get(pk=user_id, is_staff=True)
        if user == request.user:
            return Response({'error': 'Impossible de supprimer votre propre compte'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'success': True})
    except User.DoesNotExist:
        return Response({'error': 'Admin introuvable'}, status=status.HTTP_404_NOT_FOUND)
