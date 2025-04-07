# backend/createsuperuser.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

if not User.objects.filter(username="admin").exists():
    User.objects.create_superuser("sabrina", "admin@example.com", "eusoulegal")
    print("Superusuário criado.")
else:
    print("Superusuário já existe.")
