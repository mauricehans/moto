from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = 'Lists all admin users (superusers) with their username, email, and name.'

    def handle(self, *args, **options):
        User = get_user_model()
        admins = User.objects.filter(is_superuser=True)

        if admins.exists():
            self.stdout.write(self.style.SUCCESS("Found admin users:"))
            for admin in admins:
                self.stdout.write(
                    f"- Username: {admin.username}, "
                    f"Email: {admin.email}, "
                    f"Name: {admin.first_name} {admin.last_name}"
                )
        else:
            self.stdout.write(self.style.WARNING("No admin users found."))
